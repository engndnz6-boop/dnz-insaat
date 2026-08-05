# DNZ İnşaat — E-Ticaret & Ürün Kataloğu

Alçıpan asma tavan, ışık bandı, taşyünü, karolam, clip-in, bölme duvar uygulamaları ve malzeme satışı.

## Başlatma

```bash
npm install
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin

## Admin şifresi

Şifre kodda tutulmaz. `.env.local` dosyasına ekleyin:

```bash
ADMIN_PASSWORD=guclu-bir-sifre
```

Canlıda (Vercel): Project → Settings → Environment Variables → `ADMIN_PASSWORD`

## OneDrive (fotoğraf + ürün kaydı)

Ürün fotoğrafları ve ürün listesi Microsoft OneDrive’a yazılır. Böylece her ziyaretçi aynı içeriği görür.

### 1) Azure uygulama kaydı

1. [Azure Portal → App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) → **New registration**
2. Name: `DNZ Katalog`
3. Supported account types: **Personal Microsoft accounts** (veya “Accounts in any org + personal”)
4. Redirect URI: platform **Web** → `http://localhost:3456/callback`
5. Register sonrası **Application (client) ID**’yi kopyalayın → `MICROSOFT_CLIENT_ID`
6. **Certificates & secrets** → New client secret → Value’yu kopyalayın → `MICROSOFT_CLIENT_SECRET`
7. **API permissions** → Add → Microsoft Graph → **Delegated** → `Files.ReadWrite` → Add  
   (İsterseniz “Grant admin consent” — kişisel hesapta genelde giriş sırasında onay yeter)

### 2) Yerel token

`.env.local`:

```bash
ADMIN_PASSWORD=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_TENANT_ID=common
ONEDRIVE_FOLDER=DNZ-Site
```

Sonra:

```bash
npm run onedrive:auth
```

Tarayıcıda Microsoft hesabınızla giriş yapın. Terminalde çıkan `MICROSOFT_REFRESH_TOKEN=...` satırını `.env.local` ve Vercel Environment Variables’a ekleyin.

### 3) Vercel

Aynı değişkenleri Production’a ekleyip redeploy edin.

Admin panelinin üstünde yeşil **OneDrive: Bağlı** bandı görünmeli. Fotoğraf yüklediğinizde OneDrive’da `DNZ-Site/images/` klasörüne düşer; ürünler `DNZ-Site/products.json` dosyasına yazılır.

## Marka

Tüm firma bilgileri: `src/lib/brand.ts`  
WhatsApp numarası: `src/lib/whatsapp.ts`
