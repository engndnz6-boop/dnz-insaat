/**
 * OneDrive OAuth — tek seferlik refresh token alma.
 *
 * Kullanım:
 *   1. Azure'da uygulama kaydı oluşturun (aşağıdaki README adımları)
 *   2. .env.local içine CLIENT_ID ve CLIENT_SECRET yazın
 *   3: node scripts/onedrive-auth.mjs
 *   4. Tarayıcıda giriş yapın; çıkan REFRESH_TOKEN'ı kopyalayın
 */

import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";

const PORT = 3456;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = "https://graph.microsoft.com/Files.ReadWrite offline_access";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const clientId = process.env.MICROSOFT_CLIENT_ID?.trim();
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET?.trim();
const tenant = process.env.MICROSOFT_TENANT_ID?.trim() || "common";

if (!clientId || !clientSecret) {
  console.error(
    "Eksik: MICROSOFT_CLIENT_ID ve MICROSOFT_CLIENT_SECRET (.env.local)"
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl =
  `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?` +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT,
    response_mode: "query",
    scope: SCOPE,
    state,
  }).toString();

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.searchParams.get("state") !== state) {
    res.writeHead(400);
    res.end("State uyuşmazlığı");
    return;
  }

  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error_description");
  if (!code) {
    res.writeHead(400);
    res.end(err || "Kod alınamadı");
    return;
  }

  try {
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: REDIRECT,
          grant_type: "authorization_code",
          scope: SCOPE,
        }),
      }
    );
    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.refresh_token) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(JSON.stringify(data, null, 2));
      console.error(data);
      server.close();
      return;
    }

    console.log("\n========== .env.local / Vercel ==========");
    console.log(`MICROSOFT_REFRESH_TOKEN=${data.refresh_token}`);
    console.log("=========================================\n");

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<h1>Başarılı</h1><p>Refresh token terminalde yazdırıldı. Bu pencereyi kapatabilirsiniz.</p>"
    );
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  } finally {
    setTimeout(() => server.close(), 500);
  }
});

server.listen(PORT, () => {
  console.log("Tarayıcıda Microsoft hesabınızla giriş yapın:\n");
  console.log(authUrl);
  console.log(`\nRedirect URI Azure'da kayıtlı olmalı: ${REDIRECT}`);
});
