#!/bin/sh

# "to avoid continuing when errors or undefined variables are present"
set -eu

echo "Starting FTP Deploy"
echo "Uploading files..."

WDEFAULT_LOCAL_DIR=${LOCAL_DIR:-"."}
WDEFAULT_REMOTE_DIR=${REMOTE_DIR:-"."}

lftp $FTP_SERVER -u $FTP_USERNAME,$FTP_PASSWORD -e "set ftp:ssl-allow no; mirror -R $WDEFAULT_LOCAL_DIR $WDEFAULT_REMOTE_DIR; quit"

echo "FTP Deploy Complete"
exit 0