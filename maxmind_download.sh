#!/bin/sh

if [ -z "$MAXMIND_LICENSE_KEY" ]; then
    echo "MAXMIND_LICENSE_KEY not set"
    exit 1
fi

echo 'Updating Maxmind DBs' 
finalDir='./maxmind'
mkdir -p $finalDir

wget -LO zip-asn.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"
tar -xf ./zip-asn.tar.gz -C ./
cp ./GeoLite2-ASN*/GeoLite2-ASN.mmdb $finalDir/GeoLite2-ASN.mmdb

rm zip-asn.tar.gz
rm -r GeoLite2*

wget -LO zip-city.tar.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_LICENSE_KEY&suffix=tar.gz"
tar -xf ./zip-city.tar.gz -C ./
cp ./GeoLite2-City*/GeoLite2-City.mmdb $finalDir/GeoLite2-City.mmdb

rm zip-city.tar.gz
rm -r GeoLite2*