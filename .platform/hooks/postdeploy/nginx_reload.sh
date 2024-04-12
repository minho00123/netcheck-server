#!/bin/sh

# If the application successfully deployed to EB, then it will be executed from working directory.
nginx -s reload
