# Troubleshooting Localhost Connection Refused Error

## Error Message
```
ERR_CONNECTION_REFUSED
This site can't be reached
localhost refused to connect
```

---

## Understanding the Error

### What This Means
The browser tried to connect to a service on your computer (localhost), but nothing was listening on that address and port. This is like calling a phone number where nobody answers.

**Common Scenarios:**
- Your development server isn't running
- The server is running on a different port than expected
- A firewall is blocking the connection
- Another application is using the port
- The server crashed or failed to start

---

## PART 1: Immediate Checks

### Step 1: Verify the Correct URL

Check the URL in your browser's address bar.

**Common Format:**
```
http://localhost:PORT
```

**Examples:**
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React/Next.js common)
- `http://localhost:8080` (Various frameworks)

**Common Mistakes:**
- ❌ `https://localhost:5173` (using HTTPS instead of HTTP)
- ❌ `localhost:5173` (missing http://)
- ❌ `http://localhost` (missing port number)

**Quick Fix:**
```
Correct format: http://localhost:5173
                └─┬─┘ └────┬────┘ └┬┘
                  │        │       │
               Protocol  Host    Port
```

---

### Step 2: Check Terminal for Error Messages

Look at the terminal/command prompt where you started the server.

**What to Look For:**

**✅ Success - Server Running:**
```
VITE v5.4.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**❌ Error - Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**❌ Error - Server Crashed:**
```
[vite] Internal server error
Error: Something went wrong
```

**❌ No Terminal Open:**
If you don't have a terminal open with server output, the server isn't running. Continue to Step 3.

---

### Step 3: Is the Development Server Running?

**Check if you have a terminal with the server running:**

**On Windows:**
- Look for Command Prompt, PowerShell, or Terminal windows
- Look for an open VS Code integrated terminal
- Check your taskbar for Node.js icons

**On macOS/Linux:**
- Check for Terminal or iTerm windows
- Look in VS Code for integrated terminal
- Press `Cmd + Tab` (macOS) to see all open applications

**If you find a terminal with server output:**
- The server is running → Skip to Part 2
- The terminal is empty or at a prompt → Server needs to be started

**If you don't find any terminal:**
- The server is not running → Continue to Step 4

---

### Step 4: Start the Development Server

Navigate to your project directory and start the server.

**For This Project (Vite + React):**

```bash
# Navigate to project directory
cd /tmp/cc-agent/52541250/project

# Install dependencies (if first time or after pulling code)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.4.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**If you see the success message:**
1. Copy the URL shown (e.g., `http://localhost:5173/`)
2. Paste it into your browser
3. The application should load

**If you see an error:**
- Continue to the relevant section below based on the error message

---

## PART 2: Service Verification

### Check if Something is Listening on the Port

Verify if any application is listening on the expected port.

#### On Windows:

```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173
```

**Interpreting the Output:**

**✅ Service Running (Good):**
```
TCP    0.0.0.0:5173           0.0.0.0:0              LISTENING       12345
TCP    [::]:5173              [::]:0                 LISTENING       12345
```
This means something IS listening on port 5173. If the server should be running but you still get connection refused, continue to Part 3.

**❌ No Output (Nothing Listening):**
If the command returns nothing, no service is listening on port 5173. You need to start your development server (see Step 4 above).

**Find what's using the port:**
```powershell
# Using the PID from above (e.g., 12345)
tasklist | findstr 12345
```

---

#### On macOS/Linux:

```bash
# Check if port 5173 is in use
lsof -i :5173

# Alternative method
netstat -an | grep 5173
```

**Interpreting the Output:**

**✅ Service Running (Good):**
```
COMMAND   PID      USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node      12345    user   23u  IPv4 0x1234567890      0t0  TCP *:5173 (LISTEN)
```
This shows Node.js is listening on port 5173.

**❌ No Output (Nothing Listening):**
No service is running on that port. Start your development server.

**Find details about the process:**
```bash
# Using the PID from above (e.g., 12345)
ps aux | grep 12345
```

---

### Check if the Correct Port is Being Used

Your server might be running on a different port than you expect.

**Check all listening ports:**

#### On Windows:
```powershell
netstat -ano | findstr LISTENING | findstr :300
netstat -ano | findstr LISTENING | findstr :500
netstat -ano | findstr LISTENING | findstr :800
```

#### On macOS/Linux:
```bash
# Show all listening ports
lsof -i -P | grep LISTEN

# Filter for common development ports
lsof -i -P | grep LISTEN | grep -E ':(3000|5173|8080|8000)'
```

**Look for Node.js processes** in the output and note their port numbers.

---

## PART 3: Port and Firewall Diagnostics

### Check for Port Conflicts

If you get "address already in use" error, another application is using that port.

#### Solution 1: Kill the Process Using the Port

**On Windows:**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Note the PID (last column), then kill it
taskkill /PID 12345 /F
```

**On macOS/Linux:**
```bash
# Find and kill process on port 5173
lsof -ti :5173 | xargs kill -9

# Or do it in one step:
kill -9 $(lsof -ti :5173)
```

**Then restart your development server:**
```bash
npm run dev
```

---

#### Solution 2: Use a Different Port

Configure your application to use a different port.

**For Vite Projects:**

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Change to any available port
  }
})
```

**Or specify port when starting:**
```bash
npm run dev -- --port 3000
```

---

### Check Firewall Settings

Firewalls can block localhost connections in rare cases.

#### On Windows:

1. Press `Win + R`, type `firewall.cpl`, press Enter
2. Click "Advanced settings"
3. Check "Inbound Rules" for rules blocking Node.js or your port
4. Temporarily disable Windows Firewall to test:
   - Go to "Windows Security" → "Firewall & network protection"
   - Turn off firewall for "Private networks"
   - Try accessing localhost again
   - **Remember to turn it back on!**

#### On macOS:

1. Go to System Preferences → Security & Privacy → Firewall
2. Check if firewall is enabled
3. Click "Firewall Options"
4. Ensure Node.js is allowed
5. Temporarily disable firewall to test (remember to re-enable)

#### On Linux:

```bash
# Check if firewall is active
sudo ufw status

# Temporarily disable (for testing only)
sudo ufw disable

# Test your application

# Re-enable firewall
sudo ufw enable
```

---

### Check Hosts File

Verify localhost is correctly mapped to 127.0.0.1.

#### On Windows:

```powershell
# View hosts file
notepad C:\Windows\System32\drivers\etc\hosts
```

#### On macOS/Linux:

```bash
# View hosts file
cat /etc/hosts
```

**Required Entry:**
```
127.0.0.1       localhost
::1             localhost
```

**If the entry is missing or commented out (with #):**

1. Open the file with administrator/sudo privileges
2. Add the line `127.0.0.1       localhost`
3. Save and close
4. Try accessing localhost again

---

## PART 4: Common Solutions

### Solution 1: Restart the Development Server

The most common fix for connection issues.

```bash
# Stop the server
# Press Ctrl + C in the terminal running the server

# Wait for it to fully stop (2-3 seconds)

# Start it again
npm run dev
```

---

### Solution 2: Clear Node Modules and Reinstall

Corrupted dependencies can cause server startup failures.

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# On Windows use:
# rmdir /s /q node_modules
# del package-lock.json

# Reinstall dependencies
npm install

# Start server
npm run dev
```

---

### Solution 3: Check for Multiple Node Processes

Multiple Node processes might be running and causing conflicts.

#### On Windows:
```powershell
# List all Node processes
tasklist | findstr node

# Kill all Node processes
taskkill /F /IM node.exe

# Restart your server
npm run dev
```

#### On macOS/Linux:
```bash
# List all Node processes
ps aux | grep node

# Kill all Node processes
killall node

# Or more forcefully:
killall -9 node

# Restart your server
npm run dev
```

---

### Solution 4: Update Package.json Scripts

Ensure the dev script is correctly configured.

**Check `package.json`:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**If your script is different or missing:**
1. Add or fix the `dev` script
2. Save the file
3. Run `npm run dev` again

---

### Solution 5: Try Alternative Access Methods

Test if the server is accessible through different addresses.

**Try these URLs in order:**

1. `http://localhost:5173` (standard)
2. `http://127.0.0.1:5173` (IP address)
3. `http://0.0.0.0:5173` (all interfaces)
4. Check terminal for the exact URL shown

**If 127.0.0.1 works but localhost doesn't:**
- Your hosts file might be misconfigured (see "Check Hosts File" above)

---

## PART 5: Advanced Troubleshooting

### Check Network Interface Configuration

Verify localhost network interface is working.

#### On Windows:
```powershell
# Check if localhost resolves correctly
ping localhost

# Expected output:
# Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
```

#### On macOS/Linux:
```bash
# Check if localhost resolves correctly
ping -c 4 localhost

# Check network interfaces
ifconfig | grep -A 2 lo0

# Expected to see 127.0.0.1 for loopback
```

**If ping fails:**
1. Your network stack might be broken
2. Try restarting your computer
3. Check if VPN or network security software is interfering

---

### Check for VPN or Proxy Interference

VPNs and proxies can sometimes interfere with localhost connections.

**Test:**
1. Disconnect from VPN
2. Disable proxy settings:
   - **Windows:** Settings → Network & Internet → Proxy → Disable
   - **macOS:** System Preferences → Network → Advanced → Proxies → Uncheck all
   - **Browser:** Check browser proxy settings
3. Try accessing localhost again

---

### Verify Node.js Installation

Ensure Node.js is properly installed and accessible.

```bash
# Check Node version
node --version

# Expected: v18.0.0 or higher

# Check npm version
npm --version

# Expected: v9.0.0 or higher
```

**If commands not found:**
1. Node.js isn't installed or not in PATH
2. Install Node.js from https://nodejs.org/
3. Restart terminal after installation
4. Try again

---

### Check for Antivirus Interference

Some antivirus software blocks localhost connections.

**Test:**
1. Temporarily disable antivirus software
2. Try accessing localhost
3. If it works, add Node.js to antivirus exceptions
4. Re-enable antivirus

**Common culprits:**
- Avast
- AVG
- Kaspersky
- Windows Defender (rarely)

---

### Review Environment Variables

Check if environment variables are interfering.

```bash
# View relevant environment variables
# On Windows:
set | findstr NODE
set | findstr PORT

# On macOS/Linux:
env | grep NODE
env | grep PORT
```

**Look for:**
- `NODE_ENV` (should be "development" for dev server)
- `PORT` (might override default port)
- `HOST` (might affect binding address)

**Clear problematic variables:**

```bash
# On Windows:
set PORT=
set HOST=

# On macOS/Linux:
unset PORT
unset HOST
```

---

### Check Server Configuration

Review `vite.config.ts` for misconfigurations.

**Common Issues:**

**Issue 1: Server not configured to listen on all interfaces**
```typescript
// May not work:
export default defineConfig({
  server: {
    host: 'localhost'
  }
})

// Try this instead:
export default defineConfig({
  server: {
    host: true  // Listen on all interfaces
  }
})
```

**Issue 2: HTTPS configuration without certificates**
```typescript
// Can cause connection refused:
export default defineConfig({
  server: {
    https: true  // Without proper certificates
  }
})

// Fix: Remove HTTPS or add proper certificates
export default defineConfig({
  server: {
    // Remove https option for local development
  }
})
```

---

### Test with a Minimal Server

Create a simple test server to isolate the issue.

**Create `test-server.js`:**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is working!');
});

server.listen(5173, 'localhost', () => {
  console.log('Test server running at http://localhost:5173/');
});
```

**Run it:**
```bash
node test-server.js
```

**Access:** `http://localhost:5173`

**Results:**
- **Works:** Node.js and networking are fine. Issue is with your app configuration.
- **Doesn't work:** System-level networking issue. Try rebooting or checking network settings.

---

### Check System Resources

Low system resources can prevent server startup.

#### On Windows:
```powershell
# Check memory usage
tasklist /fi "imagename eq node.exe"

# Open Task Manager (Ctrl+Shift+Esc) and check:
# - CPU usage
# - Memory usage
# - Disk usage
```

#### On macOS/Linux:
```bash
# Check system resources
top -l 1 | head -n 10

# Check disk space
df -h

# Check memory
free -h  # Linux only
```

**If resources are low:**
1. Close unnecessary applications
2. Restart your computer
3. Try starting the server again

---

## Quick Reference: Common Port Numbers

| Framework/Tool | Default Port | Alternative |
|---------------|--------------|-------------|
| Vite | 5173 | 5174, 5175... |
| Create React App | 3000 | 3001, 3002... |
| Next.js | 3000 | 3001, 3002... |
| Vue CLI | 8080 | 8081, 8082... |
| Angular | 4200 | 4201, 4202... |
| Express (custom) | 3000 | Any available |

---

## Diagnostic Checklist

Use this checklist to systematically diagnose the issue:

**Basic Checks:**
- [ ] Correct URL format (`http://localhost:PORT`)
- [ ] Development server is running
- [ ] Terminal shows no error messages
- [ ] Correct port number in URL
- [ ] Using HTTP not HTTPS (unless configured)

**Port Checks:**
- [ ] Port is not in use by another process
- [ ] Something is listening on the expected port
- [ ] Firewall isn't blocking the port
- [ ] No VPN interfering with localhost

**System Checks:**
- [ ] Hosts file contains `127.0.0.1 localhost`
- [ ] `ping localhost` works
- [ ] Node.js is installed (`node --version`)
- [ ] Sufficient system resources available

**Application Checks:**
- [ ] `npm install` completed successfully
- [ ] No errors in server startup
- [ ] Server configuration is correct
- [ ] Dependencies are not corrupted

---

## Step-by-Step Resolution Flow

```
1. Is the URL correct? (http://localhost:PORT)
   NO → Fix URL format
   YES → Continue

2. Is the dev server running?
   NO → Start with: npm run dev
   YES → Continue

3. Does terminal show errors?
   YES → Fix specific error
   NO → Continue

4. Is something listening on the port?
   NO → Server failed to start (check logs)
   YES → Continue

5. Can you access via 127.0.0.1:PORT?
   YES → Hosts file issue
   NO → Continue

6. Is firewall blocking?
   YES → Allow Node.js in firewall
   NO → Continue

7. Try these in order:
   - Restart server
   - Kill all Node processes and restart
   - Restart computer
   - Reinstall dependencies
   - Check VPN/proxy settings
```

---

## Prevention Tips

**1. Always check the terminal before accessing localhost**
- Verify the server started successfully
- Note the exact URL and port shown

**2. Close servers properly**
```bash
# Use Ctrl+C to stop, not closing the terminal
# Wait for graceful shutdown
```

**3. Use one terminal per project**
- Avoid confusion about which server is running where
- Name your terminals/tabs by project

**4. Monitor port usage**
```bash
# Periodically check for orphaned Node processes
# On macOS/Linux:
ps aux | grep node

# On Windows:
tasklist | findstr node
```

**5. Keep dependencies updated**
```bash
# Check for updates regularly
npm outdated

# Update dependencies
npm update
```

---

## Getting Help

If you've tried all solutions and still have issues, gather this information:

**System Information:**
```bash
# Operating System version
# Node.js version: node --version
# npm version: npm --version
# Project type: (Vite, CRA, Next.js, etc.)
```

**Error Details:**
- Exact error message from browser
- Terminal output when starting server
- Output of `lsof -i :5173` or `netstat -ano | findstr :5173`
- Any error messages in browser console (F12)

**What You've Tried:**
- List all troubleshooting steps attempted
- Results of each step
- Any changes made to configuration

---

## Most Common Fixes (Quick List)

**95% of issues are solved by one of these:**

1. ✅ **Start the development server**: `npm run dev`
2. ✅ **Use correct URL**: `http://localhost:5173` (not https)
3. ✅ **Kill port conflict**: `kill -9 $(lsof -ti :5173)`
4. ✅ **Restart everything**: Stop server, kill Node processes, restart
5. ✅ **Reinstall dependencies**: `rm -rf node_modules && npm install`

**Start with these five steps before diving into advanced troubleshooting!**
