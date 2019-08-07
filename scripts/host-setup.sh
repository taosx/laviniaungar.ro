#!/bin/sh

OPENRESTY_VERSION="1.15.8.1"

echo "Downloading openresty, installing dependencies, installing openresty..."
wget "https://openresty.org/download/openresty-${OPENRESTY_VERSION}.tar.gz" && \
    tar -xf "openresty-${OPENRESTY_VERSION}.tar.gz" && \
    cd "openresty-${OPENRESTY_VERSION}" && \
    sudo apt update && \
    sudo apt-get install build-essential -qq && \
    sudo apt-get install libreadline-dev libncurses5-dev zlib1g zlib1g-dev \
        libpcre3 libpcre3-dev libssl-dev perl -qq && \
    ./configure -j2 --with-pcre-jit --with-ipv6 && \
    make -j2 && \
    sudo make install && \
    echo "OpenResty installation complete" && \
    sleep 2 && \
    echo "===============================" && \
    echo "===============================" && \
    echo "Adding openresty service to systemd..." && \
    cd ".." && \
    sudo cp -f system-config/openresty.service /etc/systemd/system/openresty.service && \
    echo "Setting openresty configuration..." && \
    sudo mkdir /usr/local/openresty/nginx/sites  && \
    sudo mkdir /var/log/openresty && \
    sudo rm -f /usr/local/openresty/nginx/html/index.html && \
    sudo mkdir /usr/local/openresty/nginx/html/default && \
    sudo cp -r openresty-config/* /usr/local/openresty/nginx/ && \
    echo "Enabling OpenResty service to start on boot..." && \
    sudo systemctl daemon-reload && \
    sudo systemctl restart openresty && \
    echo "Starting open resty..."