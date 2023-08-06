
import json
import base64
import boto3
import pymysql

# Configuration values
endpoint = 'ctecdatabaseidone.capdzgn2aaws.us-east-1.rds.amazonaws.com'
username = 'admin'
password = 'isaacjl2111'
database_name = 'noteweb'
collection_id = 'your_rekognition_collection_id'

rekognition_client = boto3.client('rekognition')
s3_bucket_name = 'imageface2201925a'

connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)

def get_profile_by_username(username):
    cursor = connection.cursor()

    # Retrieve profile data by username
    cursor.execute('SELECT username, password, face, profile FROM profiles WHERE username=%s', (username,))
    result = cursor.fetchone()

    return result
def add_profile(event, context):
    try:
        profile_data = json.loads(event['body'])
        username = profile_data['username']
        password = profile_data['password']
        face_base64 = profile_data['face']

        # Decode the base64 encoded face image data
        face_data = base64.b64decode(face_base64)

        # Upload the face image directly to S3
        s3_client = boto3.client('s3')
        s3_object_key = f"profile_faces/{username}.jpg"  # Change the filename as per your requirement
        s3_client.upload_fileobj(face_data, s3_bucket_name, s3_object_key, ExtraArgs={'ACL': 'public-read'})

        # Get the S3 object URL
        s3_object_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{s3_object_key}"

        # Insert the profile data into the profiles table
        cursor.execute('INSERT INTO profiles (username, password, face) VALUES (%s, %s, %s)',
               (username, password, s3_object_url))

        cursor = connection.cursor()

        # Insert the profile data into the profiles table
        cursor.execute('INSERT INTO profiles (username, password, face) VALUES (%s, %s, %s)',
                       (username, password, s3_object_key))
        connection.commit()

        response = {
            'statusCode': 200,
            'body': 'Profile added successfully',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }
        return response
    except Exception as e:
        # Log the error for debugging purposes (you can use CloudWatch Logs)
        print(f"Error occurred: {str(e)}")
        # Return an error response with appropriate status code and message
        return {
            'statusCode': 500,
            'body': 'An error occurred while adding the profile.',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }


def login(event, context):
    try:
        # Get request parameters: username, password, and base64-encoded face image
        username = event['queryStringParameters']['username']
        password = event['queryStringParameters']['password']
        face_base64 = event['queryStringParameters']['face']

        # Get profile data by username from the database
        profile_data = get_profile_by_username(username)

        if not profile_data:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'User not found'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                }
            }

        # Extract data from the database query result
        stored_password = profile_data[1]
        image_file_url = profile_data[2]
        profile = profile_data[3]

        # Decode the base64 encoded face image data
        face_data = base64.b64decode(face_base64)

        # Upload the face image to S3 (Optional: You can skip this step if the image is already stored in S3)
        s3_client = boto3.client('s3')
        s3_object_key = f"profile_faces/{username}_login.jpg"  # Change the filename as per your requirement
        s3_client.put_object(
            Bucket=s3_bucket_name,
            Key=s3_object_key,
            Body=face_data,
            ACL="public-read",
            ContentType="image/jpeg"
        )

        # Call Amazon Rekognition to compare the image with the stored face image
        response = rekognition_client.compare_faces(
            SourceImage={'S3Object': {'Bucket': s3_bucket_name, 'Name': s3_object_key}},
            TargetImage={'S3Object': {'Bucket': s3_bucket_name, 'Name': image_file_url}},
            SimilarityThreshold=70,  # Adjust the threshold as needed
        )

        # Check if any face matches were found
        if response['FaceMatches']:
            matched_face = response['FaceMatches'][0]
            confidence = matched_face['Similarity']

            # Check if the provided password matches the stored password
            if password == stored_password:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': 'Login successful', 'profile': profile}),
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                    }
                }
            else:
                return {
                    'statusCode': 401,
                    'body': json.dumps({'message': 'Login failed: Password incorrect'}),
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                    }
                }
        else:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Login failed: Face not recognized'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                }
            }

    except Exception as e:
        # Log the error for debugging purposes (you can use CloudWatch Logs)
        print(f"Error occurred: {str(e)}")
        # Return an error response with appropriate status code and message
        return {
            'statusCode': 500,
            'body': 'An error occurred while processing the login request.',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }

def lambda_handler(event, context):
    try:
        http_method = event['httpMethod']
        if not http_method:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid input data.'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                    "Access-Control-Allow-Methods": "OPTIONS, POST, DELETE, GET",
                    "Content-Type": "application/json"
                }
            }
        if http_method == 'POST':
            return add_profile(event, context)
        elif http_method == 'GET':
            return login(event, context)
        else:
            return {
                'statusCode': 400,
                'body': 'Invalid HTTP method'
            }

    except Exception as e:
        # Log the error for debugging purposes (you can use CloudWatch Logs)
        print(f"Error occurred: {str(e)}")
        # Return an error response with appropriate status code and message
        return {
            'statusCode': 500,
            'body': 'An error occurred while processing the request.'
        }
