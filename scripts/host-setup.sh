#!/bin/bash

OPENRESTY_VERSION=1.15.8.1
OPENSSL_VERSION=1.1.0j
PCRE_VERSION=8.42
LUAROCKS_VERSION=3.1.3

readonly NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1)

CWD=$(pwd)

echo "==> Updating & Upgrading system" \
    && sudo apt update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        curl \
        gettext-base \
        libgd-dev \
        libgeoip-dev \
        libncurses5-dev \
        libperl-dev \
        libreadline-dev \
        libxslt1-dev \
        make \
        perl \
        unzip \
        zlib1g-dev \
    && cd /tmp \
    && echo "==> Downloading OpenSSL v${OPENSSL_VERSION}..." \
    && curl -sSL https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz | tar -xvz \
    && echo "==> Downloading PCRE v${PCRE_VERSION}..." \
    && curl -sSL https://ftp.pcre.org/pub/pcre/pcre-${PCRE_VERSION}.tar.gz | tar -xvz \
    && cd /tmp/pcre-${PCRE_VERSION} \
    && echo "==> Configuring PCRE..." \
    && ./configure \
        --prefix=/usr/local/openresty/pcre \
        --disable-cpp \
        --enable-jit \
        --enable-utf \
        --enable-unicode-properties \
    && echo "==> Building PCRE..." \
    && make -j"${NPROC}" \
    && sudo make -j"${NPROC}" install \
    && cd /tmp \
    && echo "==> Downloading OpenResty..." \
    && curl -sSL https://openresty.org/download/openresty-${OPENRESTY_VERSION}.tar.gz | tar -xvz \
    && echo "==> Configuring OpenResty..." \
    && cd /tmp/openresty-${OPENRESTY_VERSION} \
    && ./configure -j"${NPROC}" \
        --with-openssl=/tmp/openssl-${OPENSSL_VERSION} \
        --with-pcre \
        --with-cc-opt='-DNGX_LUA_ABORT_AT_PANIC -I/usr/local/openresty/pcre/include' \
        --with-ld-opt='-L/usr/local/openresty/pcre/lib -Wl,-rpath,/usr/local/openresty/pcre/lib' \
        --with-compat \
        --with-file-aio \
        --with-http_addition_module \
        --with-http_auth_request_module \
        --with-http_dav_module \
        --with-http_flv_module \
        --with-http_geoip_module=dynamic \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_image_filter_module=dynamic \
        --with-http_mp4_module \
        --with-http_random_index_module \
        --with-http_realip_module \
        --with-http_secure_link_module \
        --with-http_slice_module \
        --with-http_ssl_module \
        --with-http_stub_status_module \
        --with-http_sub_module \
        --with-http_v2_module \
        --with-http_xslt_module=dynamic \
        --with-ipv6 \
        --with-mail \
        --with-mail_ssl_module \
        --with-md5-asm \
        --with-pcre-jit \
        --with-sha1-asm \
        --with-stream \
        --with-stream_ssl_module \
        --with-threads \
        --with-luajit-xcflags='-DLUAJIT_NUMMODE=2 -DLUAJIT_ENABLE_LUA52COMPAT' \
    && echo "==> Building OpenResty..." \
    && make -j"${NPROC}" \
    && echo "==> Installing OpenResty..." \
    && sudo make -j"${NPROC}" install \
    && cd /tmp \
    && echo "==> Downloading LuaRocks v${LUAROCKS_VERSION}..." \
    && curl -sSL https://luarocks.github.io/luarocks/releases/luarocks-${LUAROCKS_VERSION}.tar.gz | tar -xvz \
    && cd luarocks-${LUAROCKS_VERSION} \
    && echo "==> Configuring LuaRocks..." \
    && ./configure \
        --prefix=/usr/local/openresty/luajit \
        --with-lua=/usr/local/openresty/luajit \
        --lua-suffix=jit-2.1.0-beta3 \
        --with-lua-include=/usr/local/openresty/luajit/include/luajit-2.1 \
    && echo "==> Building LuaRocks..." \
    && make build \
    && echo "==> Installing LuaRocks..." \
    && sudo make install \
    && cd /tmp \
    && echo "==> Cleaning installation artifacts..." \
    && rm -rf \
        openssl-${OPENSSL_VERSION} \
        openresty-${OPENRESTY_VERSION} \
        pcre-${PCRE_VERSION} \
        luarocks-${LUAROCKS_VERSION} \
    && DEBIAN_FRONTEND=noninteractive apt-get autoremove -y \
    && echo "==> Adding openresty service to systemd..." \
    && cd "$CWD" \
    && sudo cp -f system-config/openresty.service /etc/systemd/system/openresty.service \
    && echo "Setting openresty configuration..." \
    && sudo mkdir -p /usr/local/openresty/nginx/sites  \
    && sudo mkdir -p /var/log/openresty \
    && sudo mkdir -p /etc/resty-auto-ssl/storage/file \
    && sudo chown -R www-data:www-data /etc/resty-auto-ssl/ \
    && sudo rm -f /usr/local/openresty/nginx/html/index.html \
    && sudo mkdir -p /usr/local/openresty/nginx/html/default \
    && sudo cp -r openresty-config/* /usr/local/openresty/nginx/ \
    && echo "Enabling OpenResty service to start on boot..." \
    && sudo systemctl daemon-reload \
    && sudo systemctl enable openresty \
    && sudo systemctl restart openresty \
    && echo "Starting open resty..."

# && ln -sf /dev/stdout /usr/local/openresty/nginx/logs/access.log \
# && ln -sf /dev/stderr /usr/local/openresty/nginx/logs/error.log \
    
# Add additional binaries into PATH for convenience
PATH=$PATH:/usr/local/openresty/luajit/bin:/usr/local/openresty/nginx/sbin:/usr/local/openresty/bin

# Add LuaRocks paths
# If OpenResty changes, these may need updating:
#    /usr/local/openresty/bin/resty -e 'print(package.path)'
#    /usr/local/openresty/bin/resty -e 'print(package.cpath)'
export LUA_PATH="/usr/local/openresty/site/lualib/?.ljbc;/usr/local/openresty/site/lualib/?/init.ljbc;/usr/local/openresty/lualib/?.ljbc;/usr/local/openresty/lualib/?/init.ljbc;/usr/local/openresty/site/lualib/?.lua;/usr/local/openresty/site/lualib/?/init.lua;/usr/local/openresty/lualib/?.lua;/usr/local/openresty/lualib/?/init.lua;./?.lua;/usr/local/openresty/luajit/share/luajit-2.1.0-beta3/?.lua;/usr/local/share/lua/5.1/?.lua;/usr/local/share/lua/5.1/?/init.lua;/usr/local/openresty/luajit/share/lua/5.1/?.lua;/usr/local/openresty/luajit/share/lua/5.1/?/init.lua"

export LUA_CPATH="/usr/local/openresty/site/lualib/?.so;/usr/local/openresty/lualib/?.so;./?.so;/usr/local/lib/lua/5.1/?.so;/usr/local/openresty/luajit/lib/lua/5.1/?.so;/usr/local/lib/lua/5.1/loadall.so;/usr/local/openresty/luajit/lib/lua/5.1/?.so"
