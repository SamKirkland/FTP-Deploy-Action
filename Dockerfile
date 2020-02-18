FROM debian:stable-slim

LABEL repository="https://github.com/SamKirkland/FTP-Deploy-Action"
LABEL maintainer="Sam Kirkland <FTP-Deploy-Action@samkirkland.com>"

RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y git-ftp
RUN apt-get install -y nodejs

COPY dist/index.js /deploy.js
RUN chmod +x deploy.js

ENTRYPOINT ["node", "../../deploy.js"]
