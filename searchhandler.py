import boto3
import json
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.ERROR)

def search_kendra(query):
    kendra_index_id = '7883faeb-b3d2-4871-ae47-3d85b0f0d2f2'
    kendra = boto3.client('kendra', region_name='us-east-1')

    try:
        # Call Kendra to perform the search
        response = kendra.query(IndexId=kendra_index_id, QueryText=query)
        search_results = response['ResultItems']
        return search_results
    except Exception as e:
        # Log the error
        logger.error(f"Error searching Kendra: {str(e)}")
        raise Exception(f"Error searching Kendra: {str(e)}")

def lambda_handler(event, context):
    # Parse the search query from the frontend
    print("Function being used")
    search_query = event['queryStringParameters']['q'] if 'queryStringParameters' in event else None
    print(search_query)

    if search_query:
        try:
            # Call the search function and get the search results
            search_results = search_kendra(search_query)

            # Return the search results as the API response with necessary headers
            response = {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps(search_results)
            }
            return response
        except Exception as e:
            # Log the error
            logger.error(f"An error occurred: {str(e)}")

            response = {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": f"An error occurred: {str(e)}"})
            }
            return response
    else:
        response = {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Search query is missing."})
        }
        return response
