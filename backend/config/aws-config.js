//connection stablish with AWS S3 bucket
// This file configures the AWS SDK to connect to an S3 bucket.

const AWS = require("aws-sdk"); 

AWS.config.update({ region: "ap-south-1" }); // Update the region to your desired AWS region( closer to audience)

const s3 = new AWS.S3(); // Create an S3 service object to interact with Amazon S3 -->This object will be used to perform operations like uploading, downloading, and managing files in S3
const S3_BUCKET = ""; // Replace with your actual S3 bucket name

module.exports = { s3, S3_BUCKET };
