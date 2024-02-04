# CS2 Server Dashboard

## Overview

A very basic CounterStrike 2 Server Dashboard!

## Features

- **Multi Server Support**: Manage all your servers from a single webpage.
- **Connected Players**: Monitor all players with details like ping, packet loss, name, and IP.
- **IP Lookup**: Optionally view IP details such as country, city, ASN, and ASN number.
- **Admin Actions**: A quick and easy way to kick/(un)ban/slay/(un)mute players using [CS2-SimpleAdmin](https://github.com/daffyyyy/CS2-SimpleAdmin) plugin.
- **VIPs Managers**: A quick and easy to add/remove/see all your VIPS using [cs2-VIPCore](https://github.com/partiusfabaa/cs2-VIPCore) plugin.
- **Console**: Execute RCON commands with some basic auto-complete suggestions.

## Installation

The recommended way to use this is through Docker and Docker Compose. I have provided 3 example docker-compose files.
1) [Standalone](https://github.com/LoV432/cs2-dashboard/blob/master/examples/docker-compose.yml)
2) [Dashboard with CS2](https://github.com/LoV432/cs2-dashboard/blob/master/examples/docker-compose-with-cs2.yml)
3) [Dashboard with CS2 and MySQL DB for CS2-SimpleAdmin and cs2-VIPCore plugin](https://github.com/LoV432/cs2-dashboard/blob/master/examples/docker-compose-with-cs2-db.yml)

## Guide: Setting Up Docker Compose and Configuring CS2 Dashboard

### Overview
This guide will walk you through the process of setting up Docker Compose and configuring the CS2 Dashboard application using a provided `docker-compose.yml` file and the generated `config.toml.example` file.

### Prerequisites
- Docker installed on your system
- Basic understanding of command line interfaces (CLI)

### Steps:

#### 1. Install Docker
If you haven't already, download and install Docker and Docker-Compose for your operating system. You can find installation instructions on the [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/standalone/).

#### 2. Prepare Docker Compose File
Ensure you have the [docker-compose.yml](https://github.com/LoV432/cs2-dashboard/blob/master/examples/docker-compose.yml) file provided in your working directory. You can set the `MAXMIND_LICENSE_KEY` if you like and then run `docker-compose up -d`. This will start the container.

#### 3. Customize the Configuration File
After starting the CS2 Dashboard container for the first time, a `config.toml.example` file will be created in your `dashboard-config` directory. Follow these steps to customize the configuration:

- Rename `config.toml.example` to `config.toml`.
- Edit the `config.toml` file according to your requirements. Here's a breakdown of the parameters you might need to adjust:

    - `vipCore`: Set to `true` if you are using VIP Core, otherwise `false`.
    - `simpleAdmin`: Set to `true` if you are using SimpleAdmin, otherwise `false`.
    - `mysqlHost`, `mysqlPort`, `mysqlUser`, `mysqlDatabase`, `mysqlPassword`: Configure MySQL connection details.
    - For each game server, configure the server details under `[[servers]]`:
        - `serverName`: A descriptive name for your server.
        - `serverIp`: IP address of your server.
        - `serverPort`: Port number of your server.
        - `rconPort`: RCON port of your server.
        - `rconPassword`: RCON password of your server.
        - `simpleAdminId`: ID of the server in SimpleAdmin (if enabled).
        - `vipCoreId`: ID of the server in VIP Core (if enabled).

#### 4. Restart the CS2 Dashboard Container
Navigate to the directory containing the `docker-compose.yml` file in your terminal and run the following command:
```
docker-compose restart
```
This command will restart the CS2 Dashboard container with the new config.

#### 5. Access CS2 Dashboard
Once the container is up and running, you can access the CS2 Dashboard by visiting `http://localhost:3000` in your web browser.

### Additional Notes:
- Remember to restart the CS2 Dashboard container after making changes to the `config.toml` file for the changes to take effect.
- Ensure that your firewall and network settings allow traffic on the specified ports (e.g., port 3000 for CS2 Dashboard and the game server ports).
- If you are having **Server connection failed** error try changing your network type to [host](https://docs.docker.com/compose/compose-file/compose-file-v3/#network_mode) and then running `docker-compose up -d`


## Previews

![Screenshot 2024-01-18 at 16-07-28 CS2 Dashboard](https://github.com/LoV432/cs2-dashboard/assets/60856741/b466efd1-59b4-472a-9066-f805232ece8e)
![ezgif-1-3729e11686](https://github.com/LoV432/cs2-dashboard/assets/60856741/c36b9ddb-8939-4d68-83c5-a9a407859373)
![Screenshot 2024-01-18 160954](https://github.com/LoV432/cs2-dashboard/assets/60856741/eaa78a96-4671-4da3-a362-7ca18caf4e1d)
![Screenshot 2024-01-18 161015](https://github.com/LoV432/cs2-dashboard/assets/60856741/1d73d8c7-cd87-4458-ba8e-3e0797bf7d62)
![Screenshot 2024-01-18 161037](https://github.com/LoV432/cs2-dashboard/assets/60856741/b4a7c8a4-6ae7-4998-b3ae-51d76a7318f1)
![Screenshot 2024-01-18 161949](https://github.com/LoV432/cs2-dashboard/assets/60856741/7c057356-7d37-4748-aa86-b6eaf777c878)
![Screenshot 2024-01-18 162012](https://github.com/LoV432/cs2-dashboard/assets/60856741/cc564b60-e943-41b6-a061-3866c1d8fa7f)
