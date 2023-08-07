
import json
import base64
import boto3
import pymysql
import bcrypt

# Configuration values
endpoint = 'ctecdatabaseidone.capdzgn2aaws.us-east-1.rds.amazonaws.com'
username = 'admin'
password = 'isaacjl2111'
database_name = 'noteweb'
collection_id = 'your_rekognition_collection_id'

rekognition_client = boto3.client('rekognition')
s3_bucket_name = 'imageface2201925a'

connection = pymysql.connect(host=endpoint, user=username, password=password, db=database_name)



def add_profile(event, context):
    try:
        profile_data = json.loads(event['body'])
        username = profile_data['username']
        password = profile_data['password']
        face_base64 = profile_data['face']

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Decode the base64 encoded face image data
        face_data = base64.b64decode(face_base64)

        # Upload the face image to S3 (Optional: You can skip this step if the image is already stored in S3)
        s3_client = boto3.client('s3')
        s3_object_key = f"profile_faces/{username}.jpg"  # Change the filename as per your requirement
        s3_client.put_object(
            Bucket=s3_bucket_name,
            Key=s3_object_key,
            Body=face_data,
            ACL="public-read",
            ContentType="image/jpeg"
        )
        # Get the S3 object URL
        s3_object_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{s3_object_key}"

        cursor = connection.cursor()

        # Insert the profile data into the profiles table with the hashed password
        cursor.execute('INSERT INTO profiles (username, password, face) VALUES (%s, %s, %s)',
                       (username, hashed_password, s3_object_url))
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
        # Handle any exceptions that occurred during registration
        print("Error during registration:", str(e))
        response = {
            'statusCode': 500,
            'body': 'Error during registration',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }
        return response


def login(event, context):
    try:
        login_data = json.loads(event['body'])
        username = login_data['username']
        face_base64 = login_data['face']

        # Decode the base64 encoded face image data
        face_data = base64.b64decode(face_base64)
        print(face_data)

        cursor = connection.cursor()

        # Retrieve the profile data for the given username
        cursor.execute('SELECT face FROM profiles WHERE username=%s', (username,))
        result = cursor.fetchone()
        

        if not result:
            # User not found
            response = {
                'statusCode': 404,
                'body': 'User not found',
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                }
            }
            return response

        stored_face_data = result[0]
        print(stored_face_data)

        # Use Amazon Rekognition to compare the stored face with the provided face
        response = rekognition_client.compare_faces(
            SourceImage={
                'Bytes': face_data
            },
            TargetImage={
                'Bytes': stored_face_data
            },
            SimilarityThreshold=80
        )

        # Check if Rekognition found a match
        if len(response['FaceMatches']) > 0:
            # Face matched, login successful
            login_result = {
                'login_status': 'success',
                'message': 'Login successful'
            }
        else:
            # Face did not match, login failed
            login_result = {
                'login_status': 'failed',
                'message': 'Login failed. Face does not match the stored profile.'
            }

        response = {
            'statusCode': 200,
            'body': json.dumps(login_result),
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
            'body': 'An error occurred while processing the login.',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }

def lambda_handler(event, context):
    try:
        # Assuming the 'add_profile' and 'login' functions are defined and implemented above
        http_method = event['httpMethod']
        if http_method == 'POST':
            return add_profile(event, context)
        elif http_method == 'GET':
            return login(event, context)
        else:
            return {
                'statusCode': 400,
                'body': 'Invalid HTTP method'
            }
    except KeyError as e:
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