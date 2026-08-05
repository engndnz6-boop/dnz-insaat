"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { useSiteSettings } from "@/lib/site-settings-context";
import type { SiteSettings } from "@/lib/site-settings";
import { compressImageFile } from "@/lib/pdf-storage";

async function uploadLogo(file: File): Promise<string> {
  const blob = await compressImageFile(file, 800, 0.9);
  const body = new FormData();
  body.append(
    "file",
    new File([blob], `logo-${Date.now()}.jpg`, { type: "image/jpeg" })
  );
  body.append("kind", "image");
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!res.ok || !data.url) {
    throw new Error(data.error || `Logo yüklenemedi (HTTP ${res.status})`);
  }
  return data.url;
}

export default function AdminSitePage() {
  const { settings, saveSettings, source } = useSiteSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (!pendingLogo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(pendingLogo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingLogo]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      let next = { ...form, companyName: form.companyName.trim() };
      if (!next.companyName) {
        throw new Error("Şirket adı gerekli.");
      }
      if (pendingLogo) {
        next = { ...next, logoUrl: await uploadLogo(pendingLogo) };
      }
      await saveSettings(next);
      setPendingLogo(null);
      setMessage("Kaydedildi. Ana sayfa ve menü güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
      setSaving(false);
    }
  };

  const logoSrc = preview || form.logoUrl;

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Site Ayarları</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-mist">
        Logo ve şirket adı menü, ana sayfa ve alt bilgide görünür. Kaynak:{" "}
        {source === "onedrive" ? "OneDrive" : source}
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-xl space-y-6 border border-black/5 bg-brand-anthracite/40 p-6"
      >
        <div>
          <label className="label-field">Şirket adı *</label>
          <input
            required
            className="input-field mt-1"
            value={form.companyName}
            onChange={(e) =>
              setForm((f) => ({ ...f, companyName: e.target.value }))
            }
            placeholder="DNZ İnşaat Malzemeleri"
          />
        </div>

        <div>
          <label className="label-field">Kısa slogan (menü altı / SEO)</label>
          <input
            className="input-field mt-1"
            value={form.tagline}
            onChange={(e) =>
              setForm((f) => ({ ...f, tagline: e.target.value }))
            }
            placeholder="İnşaat Malzemeleri & Asma Tavan"
          />
        </div>

        <div>
          <label className="label-field">Ana sayfa alt yazı</label>
          <textarea
            rows={2}
            className="input-field mt-1 resize-y"
            value={form.heroSubtitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, heroSubtitle: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="label-field">Logo</label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex h-16 items-center justify-center overflow-hidden rounded-sm bg-white px-3 py-2">
              {logoSrc ? (
                <ProductImage
                  src={logoSrc}
                  alt="Logo önizleme"
                  width={180}
                  height={48}
                  className="h-12 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <span className="text-xs text-brand-mist">Logo yok</span>
              )}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="input-field file:mr-3 file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#151920]"
              onChange={(e) => setPendingLogo(e.target.files?.[0] || null)}
            />
          </div>
          <p className="mt-2 text-xs text-brand-mist">
            PNG / JPG önerilir. Logo oranı korunur, bozulmaz.
          </p>
          <label className="label-field mt-4">veya logo URL</label>
          <input
            className="input-field mt-1"
            value={form.logoUrl}
            onChange={(e) => {
              setPendingLogo(null);
              setForm((f) => ({ ...f, logoUrl: e.target.value }));
            }}
            placeholder="/logo-dnz.png"
          />
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}
        {message && <p className="text-sm text-brand-gold">{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
