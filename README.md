# 🕷️ SpiderQueens - Global Cosplay Championship Arena

![SpiderQueens Banner](https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80&w=1200)

**SpiderQueens**, küresel çaptaki Spider-Man ve çizgi roman cosplay sanatçılarının birbirleriyle yarıştığı, hayranların oy kullanarak favori cosplayer'larını desteklediği ve ay sonunda toplam **$1,250** değerinde büyük ödül havuzunun dağıtıldığı gamified (oyunlaştırılmış) oylama ve topluluk platformudur.

---

## 📋 İçindekiler

1. [Proje Hakkında](#-proje-hakkında)
2. [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
3. [Teknoloji Yığını (Tech Stack)](#-teknoloji-yığını-tech-stack)
4. [Supabase Veritabanı Mimarısı](#-supabase-veritabanı-mimarisi)
5. [Kurulum ve Yerel Çalıştırma](#-kurulum-ve-yerel-çalıştırma)
6. [Çevre Değişkenleri (.env.local)](#-çevre-değişkenleri-envlocal)
7. [Vercel Üzerinde Canlıya Alma (Deployment)](#-vercel-üzerinde-canlıya-alma-deployment)
8. [Lisans ve İletişim](#-lisans-ve-iletişim)

---

## 🌟 Proje Hakkında

SpiderQueens, cosplay topluluğu için adil, yüksek etkileşimli ve görsel olarak büyüleyici bir şampiyona alanı sunar. 

Kullanıcılar ikili **Versus Clash (1v1 Arena)** modunda cosplayer'ları anlık olarak kıyaslayıp oy verebilir, **Liderlik Tablosu (Leaderboard)** üzerinden sıralamayı takip edebilir, **Mağaza (Store)** üzerinden Super Vote (5x güç) satın alabilir veya bir cosplayer olarak yarışmaya başvurabilirler.

### 🎯 Ana Amaçlar
* Cosplay sanatçılarına finansal destek ve küresel görünürlük sağlamak.
* Oyunlaştırılmış (Gamified) oylama mekanizmalarıyla (Free Vote vs Super Vote) kullanıcı bağlılığını artırmak.
* Şeffaf admin yönetim paneli ile adil oylama ve güvenli ödeme onay süreçleri yürütmek.

---

## ⚡ Öne Çıkan Özellikler

- 🌍 **Çok Dilli Entegrasyon (7 Dil / i18n):** Türkçe (TR), İngilizce (EN), Rusça (RU), Tayca (TH), Japonca (JA), Çince (ZH) ve Korece (KO) dil seçenekleri ve dinamik çeviri desteği.
- ⏳ **Canlı Ay Sonu Şampiyonluk Sayacı:** Her ayın son gününe otomatik odaklanan dinamik geri sayım zamanlayıcısı.
- ⚔️ **Versus Clash (1v1 Arena):** İki yarışmacıyı rastgele eşleştirip hızlı ve eğlenceli oylama sunan interaktif ikili arena.
- 🛡️ **IP Bazlı Oy Güvenliği:** Her IP adresi için günlük 5 adet ücretsiz oy limiti (Bot ve hile engelleme koruması).
- ⚡ **Super Vote Mağazası:** Günlük IP sınırını aşan, 5 kat (5x) oy gücüne sahip özel Super Vote paketleri.
- 💳 **Esnek Ödeme Yöntemleri:** Kredi Kartı ve Manuel Kripto (USDT-TRC20 / TRON) ödeme bildirimi desteği.
- 👤 **Kullanıcı Profil Modalı:** Kalan Super Vote kredisi, kullanıcı rolü (Fan / Yarışmacı) ve hesap bilgilerini gösteren modal.
- 🔐 **Yönetici Panel (Admin Dashboard):**
  - Bekleyen cosplayer başvurularını onaylama/reddetme.
  - Ödeme bildirimlerini kontrol edip Super Vote bakiyesi yükleme.
  - İstatistik paneli ve Supabase SQL şemasını tek tıkla kopyalama aracı.
- 📱 **Tam Responsive & Mobil Uyumlu:** Mobil cihazlarda sorunsuz dil menüsü, dokunmatik dostu oylama kartları ve dinamik düzen.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Bileşen | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router) / React** | Hızlı, SEO dostu ve modüler component mimarisi |
| **Dil** | **TypeScript** | Tip güvenliği ve ölçeklenebilir kod yapısı |
| **Stil & Tasarım** | **Tailwind CSS** | Modern, karanlık tema (Dark Cyberpunk) ve responsive tasarım |
| **Animasyonlar** | **Motion (Framer Motion)** | Akıcı kart geçişleri, efektler ve modal animasyonları |
| **İkon Seti** | **Lucide React** | Vektörel ve performanslı ikonlar |
| **Backend & DB** | **Supabase** | PostgreSQL Veritabanı, Auth ve Dosya Depolama (Storage) |
| **Deployment** | **Vercel** | Global Edge CDN üzerinde hızlı ve otomatik canlıya alım |

---

## 🗄️ Supabase Veritabanı Mimarisi

Proje 5 temel PostgreSQL tablosu üzerine inşa edilmiştir:

1. `profiles`: Kullanıcı hesapları, roller (`voter` / `contestant`) ve Super Vote kredi bakiyeleri.
2. `contestants`: Şampiyonaya katılan cosplayer'ların fotoğraf, instagram, onay durumu (`approved` / `pending`) ve toplam oy sayıları.
3. `votes`: Verilen her oyun kaydı (IP, oy türü, cosplayer ID).
4. `ip_tracker`: IP adreslerinin günlük ücretsiz 5 oy kullanımını denetleyen tablo.
5. `transactions`: Kredi kartı ve Kripto (USDT) ödeme bildirimleri ve admin onay durumu (`pending`, `completed`, `rejected`).

### SQL Kurulumu
Supabase Dashboard'unuzdaki **SQL Editor** bölümüne giderek aşağıdaki tablo kurulum komutlarını çalıştırabilirsiniz:

```sql
-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'voter' CHECK (role IN ('voter', 'contestant')),
  is_admin BOOLEAN DEFAULT FALSE,
  super_votes_credit INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contestants Table
CREATE TABLE public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  character_name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  instagram TEXT,
  votes_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes Table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contestant_id UUID REFERENCES public.contestants(id) ON DELETE CASCADE,
  voter_ip TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_super_vote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IP Tracker Table
CREATE TABLE public.ip_tracker (
  ip_address TEXT PRIMARY KEY,
  free_votes_used INT DEFAULT 0,
  last_vote_date DATE DEFAULT CURRENT_DATE
);

-- Transactions Table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  super_votes_amount INT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Etkinleştirme
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Okuma Politikaları
CREATE POLICY "Public read for contestants" ON public.contestants FOR SELECT USING (true);
CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
```

---

## 🚀 Kurulum ve Yerel Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici-adi/spiderqueens.git
cd spiderqueens
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Oluşturun
Proje kök dizininde `.env.local` dosyasını oluşturun ve Supabase bilgilerinizi ekleyin.

```bash
cp .env.example .env.local
```

### 4. Geliştirici Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

---

## 🔑 Çevre Değişkenleri (.env.local)

Uygulamanın Supabase servisi ile haberleşebilmesi için gerekli ortam değişkenleri:

```env
# Supabase Proje URL'niz
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co

# Supabase Anon (Public) API Anahtarı
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Service Role Anahtarı (Sadece Sunucu Tarafı / Admin İşlemleri İçin)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

## 🌐 Vercel Üzerinde Canlıya Alma (Deployment)

Projenizi **Vercel** üzerinde saniyeler içinde canlıya alabilirsiniz:

### Adım 1: GitHub'a Push Edin
```bash
git add .
git commit -m "feat: SpiderQueens production release"
git push origin main
```

### Adım 2: Vercel Projesi Oluşturun
1. [Vercel Dashboard](https://vercel.com/dashboard) hesabınıza giriş yapın.
2. **"Add New"** > **"Project"** butonuna tıklayın ve GitHub deponuzu seçin.

### Adım 3: Ortam Değişkenlerini (Environment Variables) Tanımlayın
Vercel proje ayarlarındaki **Environment Variables** bölümüne yukarıdaki değişkenleri ekleyin:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Adım 4: Deploy Butonuna Tıklayın
Vercel otomatik olarak projenizi derleyecek (`npm run build`) ve canlı URL'nizi (örneğin: `https://spiderqueens.vercel.app`) oluşturacaktır!

---

## 📄 Lisans ve İletişim

Bu proje **MIT Lisansı** ile lisanslanmıştır. 

* 🌐 **Web Sitesi:** [SpiderQueens Live App](https://spiderqueens.vercel.app)
* 📧 **Destek / İletişim:** contact@spiderqueens.com
* 🕷️ **SpiderQueens Team** - *Gamified Cosplay Arena 2026*
