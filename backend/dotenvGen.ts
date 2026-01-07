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
# API Gateway
# ===============================
API_GATEWAY_KEY=${generateSecretBase64("AGK", 256)}

# ===============================
# Database
# ===============================
AUTH_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=auth_service"
RECIPE_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=recipe_service"
USER_DATABASE_URL="postgresql://postgres.mufeesdzdecsncjbcoyr:Database42@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=user_service"
NOTIFICATION_DATABASE_URL=
CHAT_DATABASE_URL=

# ===============================
# Internal API Key
# ===============================
INTERNAL_API_KEY=${generateSecretBase64("IAK", 256)}

# ===============================
# JWT
# ===============================
JWT_SECRET=${generateSecretBase64("JWT-S", 256)}

# ===============================
# Secret pour signer les cookies
# ===============================
COOKIE_SECRET=${generateSecretBase64("CS", 256)}

# ===============================
# Sendgrid API Key
# ===============================
SENDGRID_API_KEY=${generateSecretBase64("SG", 256)}

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
