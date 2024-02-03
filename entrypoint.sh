#!/bin/sh

./maxmind_download.sh
cp /config.toml.example /app/config/config.toml.exmaple
node server.js