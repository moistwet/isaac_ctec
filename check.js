const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials and region
AWS.config.update({
  'aws_access_key_id': 'AKIAVEWGAPL4GZE5SREN',
  'aws_secret_access_id': 'r2ybfoXDYtKiZukkw2fT9UAilYUvoUIOVuWPxSPP',
  'region': 'ap-southeast-1' // Replace with your preferred region, e.g., 'us-east-1'
});

const s3 = new AWS.S3();

// Function to read a file from S3 bucket
function readFileFromS3(bucketName, fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName
  };

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Body.toString('utf-8'));
      }
    });
  });
}

// Example usage
const bucketName = 'outputtranslateddoc2201925a'; // Replace with your S3 bucket name
const fileName = 'translatebig.txt'; // Replace with the name of the file you want to read

readFileFromS3(bucketName, fileName)
  .then(fileContent => {
    console.log('File content:', fileContent);
    // Process the file content as needed
  })
  .catch(err => {
    console.error('Error reading file from S3:', err);
  });
