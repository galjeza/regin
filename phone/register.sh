#!/data/data/com.termux/files/usr/bin/bash

# -----------------------------
# WireGuard Setup for Termux + Registration Script
# -----------------------------
# Requires: wireguard-tools, curl, base64, termux-api

set -e

# -----------------------------
# Help Menu
# -----------------------------
print_help() {
  echo "\nUsage: ./register.sh [OPTIONS]"
  echo "\nOptions:"
  echo "  --main-server-ip=IP       (Required) IP of the main server"
  echo "  --phone-id=ID             (Optional) Phone identifier (auto-generated if not set)"
  echo "  --ssh-port=PORT           (Optional) SSH port (default: 8022)"
  echo "  --region=REGION           (Required) Region name (e.g. ljubljana)"
  echo "  --help                    Show this help message"
  echo ""
}

# -----------------------------
# Default values
# -----------------------------
PHONE_ID="phone-$(date +%s)"
SSH_PORT=8022
REGION=""

# -----------------------------
# Parse CLI arguments
# -----------------------------
for arg in "$@"; do
  case $arg in
    --main-server-ip=*)
      MAIN_SERVER_IP="${arg#*=}"
      ;;
    --phone-id=*)
      PHONE_ID="${arg#*=}"
      ;;
    --ssh-port=*)
      SSH_PORT="${arg#*=}"
      ;;
    --region=*)
      REGION="${arg#*=}"
      ;;
    --help)
      print_help
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $arg"
      print_help
      exit 1
      ;;
  esac
done

# Validate required arguments
if [ -z "$MAIN_SERVER_IP" ]; then
  echo "❌ Error: --main-server-ip is required"
  exit 1
fi

if [ -z "$REGION" ]; then
  echo "❌ Error: --region is required"
  exit 1
fi

# -----------------------------
# WireGuard Configuration
# -----------------------------
SERVER_PUBLIC_KEY="<your-server-public-key>"
SERVER_ENDPOINT="<your-server-ip>:51820"
PHONE_PRIVATE_KEY="$(wg genkey)"
PHONE_PUBLIC_KEY="$(echo $PHONE_PRIVATE_KEY | wg pubkey)"
WG_INTERFACE="wg0"
WG_CONFIG="/data/data/com.termux/files/home/${WG_INTERFACE}.conf"
PHONE_ADDRESS="10.66.66.2/32"

echo "📱 Phone public key: $PHONE_PUBLIC_KEY"
echo "[Peer]"
echo "PublicKey = $PHONE_PUBLIC_KEY"
echo "AllowedIPs = $PHONE_ADDRESS"

# Install wireguard-tools if missing
if ! command -v wg-quick >/dev/null 2>&1; then
  pkg update -y && pkg install wireguard-tools -y
fi

# Create WG config
cat > "$WG_CONFIG" <<EOF
[Interface]
PrivateKey = $PHONE_PRIVATE_KEY
Address = $PHONE_ADDRESS

[Peer]
PublicKey = $SERVER_PUBLIC_KEY
Endpoint = $SERVER_ENDPOINT
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

wg-quick down $WG_INTERFACE 2>/dev/null || true
wg-quick up $WG_INTERFACE

echo "✅ WireGuard VPN started. Connected to $SERVER_ENDPOINT"

# -----------------------------
# Phone Registration
# -----------------------------
SSH_USER=$(whoami)
IP=$(ip route get 1.1.1.1 | awk '{print $7; exit}')
PHONE_NUMBER="$(termux-telephony-deviceinfo | grep phone_number | cut -d '"' -f4)"
COUNTRY_CODE="$(termux-telephony-deviceinfo | grep country_code | cut -d '"' -f4)"

curl -X POST "http://$MAIN_SERVER_IP:8080/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"phoneId\": \"$PHONE_ID\",
    \"ip\": \"$IP\",
    \"port\": $SSH_PORT,
    \"user\": \"$SSH_USER\",
    \"phoneNumber\": \"$PHONE_NUMBER\",
    \"region\": \"$REGION\",
    \"countryCode\": \"$COUNTRY_CODE\"
  }"

echo "✅ Registration complete for $PHONE_ID."
