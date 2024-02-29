### Steps to Enable VipCore Feature

1. **Install and Configure the Plugin**

   - Install the [cs2-VIPCore plugin](https://github.com/partiusfabaa/cs2-VIPCore) on your CS2 Server.
   - After first launch, u need to configure plugin in addons/counterstrikesharp/configs/plugins/VIPCore/

2. **Enable VipCore on the Web Server**

   - Here are the values you need to set in your (`config.toml`) file of your cs2dasboard server:

   ```toml
    [global]
    vipCore = true # Set this to true
    simpleAdmin = false
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
    simpleAdminId = 36
    vipCoreId = 0 # ServerId in your vip_core.json. Read below for more info.
    chatLoggerId = 1
   ```

   ### Find vipCoreId Value

   - You can find this value in your addons/counterstrikesharp/configs/plugins/VIPCore/vip_core.json

   ```json
   {
   	"TimeMode": 0,
   	"ServerId": 0, // <<<< This Value
   	"VipLogging": true,
   	"Connection": {
   		"Host": "host",
   		"Database": "database",
   		"User": "user",
   		"Password": "password"
   	}
   }
   ```
