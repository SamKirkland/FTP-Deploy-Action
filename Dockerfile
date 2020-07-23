FROM archlinux:20200705

LABEL repository="https://github.com/SamKirkland/FTP-Deploy-Action"
LABEL maintainer="Sam Kirkland <FTP-Deploy-Action@samkirkland.com>"

RUN pacman -Sy
RUN pacman -S --noconfirm git nodejs
ADD https://raw.githubusercontent.com/git-ftp/git-ftp/f6dcf6218c9adae5299900f894309d1c83ebebaf/git-ftp /usr/local/bin/git-ftp
RUN chmod +x /usr/local/bin/git-ftp

COPY dist/index.js /deploy.js
RUN chmod +x deploy.js

ENTRYPOINT ["node", "../../deploy.js"]
