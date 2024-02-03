#!/bin/sh

cp /config.toml.example /app/config/config.toml.exmaple
./maxmind_download.sh
node server.js