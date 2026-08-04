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

## Marka

Tüm firma bilgileri: `src/lib/brand.ts`  
WhatsApp numarası: `src/lib/whatsapp.ts`
