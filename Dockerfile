FROM debian:10.0-slim

LABEL repository="https://github.com/SamKirkland/FTP-Deploy-Action"
LABEL maintainer="Sam Kirkland <FTP-Deploy-Action@samkirkland.com>"

RUN apt-get update \
  && apt-get install -y git git-ftp nodejs

COPY dist/index.js /deploy.js
RUN chmod +x deploy.js

ENTRYPOINT ["node", "../../deploy.js"]
