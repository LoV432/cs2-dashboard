### Steps to Enable SimpleAdmin Feature

1. **Install and Configure the Plugin**

   - Install the [CS2-SimpleAdmin plugin](https://github.com/daffyyyy/CS2-SimpleAdmin) on your CS2 Server.
   - After first launch, u need to configure plugin in addons/counterstrikesharp/configs/plugins/CS2-SimpleAdmin/CS2-SimpleAdmin.json

2. **Enable SimpleAdmin on the Web Server**

   - Here are the values you need to set in your (`config.toml`) file of your cs2dasboard server:

   ```toml
    [global]
    vipCore = false
    simpleAdmin = true # Set this to true
    preDefinedMaps = [['de_mirage', 'Mirage'], ['de_dust2', 'Dust 2']] # Optional. These values are used in a quick switch dropdown
    chatLogger = false
    chatLoggerToken = 'VerySecureTokenHere'
    mysqlHost = 'localhost'
    mysqlPort = 3306
    mysqlUser = 'root'
    mysqlDatabase = 'dbname'
    mysqlPassword = 'password'

    [[servers]]
    serverName = 'Good Name'
    serverIp = '127.0.0.1'
    serverPort = 27015
    rconPort = 27015
    rconPassword = 'password'
    simpleAdminId = 36 # Server ID set by the plugin for this specific server. Read below for more info
    preDefinedMaps = [['ws:fy_pool_day','Pool Day']] # Optional. These values are used in a quick switch dropdown
    vipCoreId = 0
    chatLoggerId = 1
   ```

   ### Find simpleAdminId Value

   - This value is created by the plugin after the first launch.
   - If you have phpMyAdmin (or any other DB viewer) installed you can go and find the "sa_servers" table in you DB. You will find the ID of each server in that table.
   - You can also run `SELECT id as simpleAdminID, address , hostname  FROM sa_servers` to reterive all the ID from CLI.
