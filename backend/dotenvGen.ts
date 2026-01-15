import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

export function generateSecretBase64(
  prefix: string,
  byteLength = 256
) {
  const secret = randomBytes(byteLength)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${prefix}.${secret}`;
}
// ===============================
// CONFIG
// ===============================
const PORTS = {
  API_GATEWAY_PORT: 3000,
  RECIPE_SERVICE_PORT: 3001,
  AUTH_SERVICE_PORT: 3002,
  USER_SERVICE_PORT: 3003,
  CHAT_SERVICE_PORT: 3004,
  NOTIFICATION_SERVICE_PORT: 3005,
};

const DOMAIN = "http://localhost";

// ===============================
// ENV CONTENT
// ===============================
const env = `
# ===============================
# Database
# ===============================
AUTH_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=auth_service"
RECIPE_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=recipe_service"
USER_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=user_service"
NOTIFICATION_DATABASE_URL=
CHAT_DATABASE_URL=

# ===============================
# API Gateway
# ===============================
API_GATEWAY_KEY=${generateSecretBase64("AGK", 32)}

# ===============================
# API Master Secret (pour signer les clés API utilisateurs)
# ===============================
API_MASTER_SECRET=${generateSecretBase64("AMS", 32)}
API_KEY_MAX_AGE_SECONDS=31536000

# ===============================
# Internal API Key
# ===============================
INTERNAL_API_KEY=${generateSecretBase64("IAK", 32)}

# ===============================
# JWT
# ===============================
JWT_SECRET=${generateSecretBase64("JWT-S", 32)}

# ===============================
# Secret pour signer les cookies
# ===============================
COOKIE_SECRET=${generateSecretBase64("CS", 32)}

# ===============================
# Resend API Key
# ===============================
RESEND_API_KEY=re_3KEBkuqx_FYTTwGXxuL6jBm5SNZn87MXk

# ===============================
# Mailbox Key
# ===============================
#MAILBOX_KEY=${generateSecretBase64("MBK", 20)}
MAILBOX_KEY=MBK.i0h3wXzVkecQybvgdUGDyh_0Fi0
MAILBOX_ADDRESS="cookshare@cookshare.me"

# ===============================
# Ports
# ===============================
API_GATEWAY_PORT=${PORTS.API_GATEWAY_PORT}
RECIPE_SERVICE_PORT=${PORTS.RECIPE_SERVICE_PORT}
AUTH_SERVICE_PORT=${PORTS.AUTH_SERVICE_PORT}
USER_SERVICE_PORT=${PORTS.USER_SERVICE_PORT}
CHAT_SERVICE_PORT=${PORTS.CHAT_SERVICE_PORT}
NOTIFICATION_SERVICE_PORT=${PORTS.NOTIFICATION_SERVICE_PORT}

# ===============================
# Local development
# ===============================
DOMAIN=${DOMAIN}

# ===============================
# Services URLs
# ===============================
API_GATEWAY_URL="\${DOMAIN}:\${API_GATEWAY_PORT}"
RECIPE_SERVICE_URL="\${DOMAIN}:\${RECIPE_SERVICE_PORT}"
AUTH_SERVICE_URL="\${DOMAIN}:\${AUTH_SERVICE_PORT}"
USER_SERVICE_URL="\${DOMAIN}:\${USER_SERVICE_PORT}"
CHAT_SERVICE_URL="\${DOMAIN}:\${CHAT_SERVICE_PORT}"
NOTIFICATION_SERVICE_URL="\${DOMAIN}:\${NOTIFICATION_SERVICE_PORT}"

# ===============================
# Cloudinary Configuration
# ===============================
CLOUDINARY_CLOUD_NAME=dyezp5egz
CLOUDINARY_API_KEY=112224448564258
CLOUDINARY_API_SECRET=ZSYn29CYQWAvV9sgwyHzHWvuY8M
CLOUDINARY_URL=cloudinary://112224448564258:ZSYn29CYQWAvV9sgwyHzHWvuY8M@dyezp5egz
`.trim();

// ===============================
// WRITE FILE
// ===============================
const outputPath = path.join(process.cwd(), ".env");

fs.writeFileSync(outputPath, env, {
  encoding: "utf-8",
  flag: "w",
});

console.log("✅ .env généré avec succès");
