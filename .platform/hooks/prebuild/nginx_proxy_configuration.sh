#!/bin/sh
# This prebuild command script is to copy kibana certification for cognito to nginx location.
# Example 1. Download resource from S3 of any buckets
export OTHER_WORKING_DIR=/home/ec2-user/
aws s3 cp s3://BucketName/KeyName $OTHER_WORKING_DIR/to/here_item_1
aws s3 cp s3://BucketName/KeyName $OTHER_WORKING_DIR/to/here_item_2


# Sometimes, the Nginx Process run as Zombie.., So you have to run this commands
# because AWS EB must exec to test what Nginx can successfully run on.
sudo systemctl stop nginx
