### Steps to Enable Chat Logger Feature

1. **Install the Plugin**

   - Install the [CS2 Chat Logger plugin](https://github.com/oqyh/cs2-Chat-Logger) on your CS2 Server.

2. **Configure the Plugin**

   - Update the discord webbook section of CS2 Chat Logger plugin configuration as follows:

   ```yaml
   "SendLogToWebHook": 3,
   "WebHookURL": "http://YOUR-WEB-SERVER-IP-PORT/api/chat-logger?server_id=1&chat_logger_token=VerySecureTokenHere",
   "LogDiscordChatFormat": "[{DATE} - {TIME}] {TEAM} {MESSAGE} (IpAddress: {IP})",
   ```

   - Ensure `"SendLogToWebHook"` and `"LogDiscordChatFormat"` are just like this.
   - Enter anything random in `chat_logger_token`. It will act as a password
   - Include a unique `server_id` for each server.

3. **Enable Chat Logger on the Web Server**

   - Here are the values you need to set in your (`config.toml`) file of your cs2dasboard server:

   ```toml
    [global]
    vipCore = false
    simpleAdmin = false
    chatLogger = true # Set this to true
    chatLoggerToken = 'VerySecureTokenHere' # This MUST match the "chat_logger_token" in your discord webhook url
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
    vipCoreId = 0
    chatLoggerId = 1 # The "server_id" value you are using in your discord webhook url for this server
   ```

   - Ensure `chatLogger` is set to `true`.
   - Set `chatLoggerToken` to match the token used in the Discord webhook URL.
