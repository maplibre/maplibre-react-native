# Example Expo App
# Steps to run (not the only way)
1. Run npm install
2. Run npx eas build --profile development --platform YOURPLATFORMHERE
Replace YOURPLATFORMHERE with android or ios
3. Install the apk from expo.dev on your target device or on an emulator (you will be prompted by expo if you want to use an emulator)
4. Open the apk and then run npm run start
5. Connect to the server from the interface in the apk file
6. Test! You can type j in the console to see the console on your computer
# Possible errors and fixes:
1. If you encounter errors like can't connect to localhost:8080 or something like that make sure your in development mode (when running npm run start you should see development mode, if it says expo go press s to change to development mode)
2. If your using a real device, just click s to change to expo go and then change back to development mode or make sure your device is plugged in by usb cable. When you press a in the console, it should say "Opening on android..."
- If it doesn't say that, and it says abd is not connected or something like that, your device is not plugged in properly.