#!/bin/sh

OPENRESTY_VERSION="1.15.8.1"

echo "Downloading openresty, installing dependencies, installing openresty..."
wget "https://openresty.org/download/openresty-${OPENRESTY_VERSION}.tar.gz" && \
    tar -xvf "openresty-${OPENRESTY_VERSION}.tar.gz" && \
    cd "openresty-${OPENRESTY_VERSION}" && \
    sudo apt update && \
    sudo apt-get install build-essential && \
    sudo apt-get install libreadline-dev libncurses5-dev libpcre3-dev libssl-dev perl && \
    ./configure -j2 --with-pcre-jit --with-ipv6 && \
    make -j2 && \
    sudo make install && \
    echo "OpenResty installation complete" && \
    sleep 2 && \
    echo "===============================" && \
    echo "===============================" && \
    echo "Adding openresty service to systemd..." && \
    sudo cp system-config/openresty.service /etc/systemd/system/openresty.service
