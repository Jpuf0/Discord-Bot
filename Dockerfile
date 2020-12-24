FROM node:14.2.0

ARG buildno
ARG commitsha

LABEL maintainer="Remco Jongschaap hello@dougley.com" \
      repository="https://github.com/TheSharks/WildBeast" \
      buildno=$buildno \
      commit=$commitsha

# Don't run wildbeast as root (safety)
RUN useradd -m -d /home/yui -s /bin/bash yui
RUN mkdir /opt/yui && chown wildbeast /opt/yui -R
# Copy files and install modules
COPY . /opt/yui
WORKDIR /opt/yui
RUN npm i --production
# Install optional native modules
RUN npm i zlib-sync uws@10.148.1 https://github.com/discordapp/erlpack.git bufferutil sodium-native node-opus

# Switch to wildbeast user and run entrypoint
USER yui
CMD ["node", "index.js"]