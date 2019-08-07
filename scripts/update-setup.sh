#!/bin/sh

if [ ! -d /usr/local/openresty/nginx/sites ]; then
    echo "Can't update setup, folder '/usr/local/openresty/nginx/sites' doesn't exist."
    exit 1
fi

if [ ! -d /var/log/openresty ]; then
    echo "Can't update setup, folder '/var/log/openresty' doesn't exist."
    exit 1
fi

if [ -f /usr/local/openresty/nginx/html/index.html ]; then
    echo "It seems 'host-setup.sh' script was not run, try to run it for initial host setup."
    exit 1
fi

if [ ! -d /usr/local/openresty/nginx/html/default ]; then
    sudo mkdir /usr/local/openresty/nginx/html/default
fi

if [ -f system-config/provided-ssl.crt ]; then
    if [ -f system-config/provided-ssl.key ]; then
        echo "SSL files provided, actions to move them in place taken."

        sudo mv system-config/provided-ssl.crt /etc/ssl/provided-ssl.crt
        sudo mv system-config/provided-ssl.key /etc/ssl/provided-ssl.key
    fi
fi

sudo cp -f system-config/openresty.service /etc/systemd/system/openresty.service && \
    echo "Setting openresty configuration..." && \
    sudo cp -r openresty-config/* /usr/local/openresty/nginx/ && \
    echo "Enabling and Starting OpenResty service to start on boot..." && \
    sudo systemctl daemon-reload && \
    sudo systemctl enable openresty && \
    sudo systemctl restart openresty