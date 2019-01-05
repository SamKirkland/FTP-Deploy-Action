FROM alpine:latest

LABEL version="1.0.0"
LABEL repository="https://github.com/SamKirkland/FTP-Deploy-Action"
LABEL homepage="https://github.com/SamKirkland/FTP-Deploy-Action"
LABEL maintainer="Sam Kirkland <FTP-Deploy-Action@samkirkland.com>"

LABEL "com.github.actions.name"="FTP Deploy Action"
LABEL "com.github.actions.description"="Deploy your website via FTP"
LABEL "com.github.actions.icon"="upload-cloud"
LABEL "com.github.actions.color"="orange"

RUN apk add lftp

COPY entrypoint.sh /entrypoint.sh
RUN chmod 777 entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
