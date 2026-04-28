# Beni Oku: HW_Demo Projesi

Bu belge, projenin temel amacını, sahip olduğu işlevleri ve çalışma mantığını (işleyişini) özetlemektedir.

## 1. Projenin Amacı ve Genel İşlevi

Bu proje, temel bir **E-Ticaret (Kitap Satış) ve Yönetim Paneli** otomasyonudur. Bir kitap mağazasının hem müşteriler tarafından alışveriş yapılabilen vitrin yüzünü, hem de mağaza yöneticileri tarafından stok, ürün ve satış performansının takip edildiği arka plan (dashboard) yüzünü içerir.

Projenin sunduğu temel özellikler şunlardır:

*   **Müşteri Arayüzü (Vitrin):** Kullanıcıların sisteme giriş yaparak kitapları inceleyebilmesi, stokta olanları sepetlerine ekleyebilmesi ve siparişlerini tamamlayabilmesi (Checkout).
*   **Yönetici Arayüzü (Dashboard):** Admin yetkisine sahip kullanıcıların mağazayı yönettiği alandır.
    *   **Ürün Yönetimi:** Yeni kitap ekleme, mevcut kitapların stoklarını yenileme (restock) ve artık satılmayacak kitapları sistemden silme (delete).
    *   **Satış ve Gelir Analizi:** Satışlardan elde edilen gelirlerin veya (test durumunda) rastgele üretilen satış miktarlarının 3 aylık, 6 aylık ve 1 yıllık periyotlar halinde filtrelenerek Çizgi (Line), Bar veya Pasta (Pie) grafikleri üzerinden görselleştirilmesi.
*   **Test ve Demo Araçları:** Yönetim panelinde sistemi hazır verilerle test etmek için "Test Verisi Oluştur" (Junk State) ve sistemi ilk temiz haline döndürmek için "Tüm Verileri Sıfırla" (Golden State) fonksiyonları bulunur.

## 2. Sistemin İşleyişi (Mimari Akış)

Sistem tam teşekküllü (Full-Stack) bir yapıya sahiptir. Ön yüz (Frontend) ve arka yüz (Backend) birbirinden bağımsız iki ayrı parça olarak çalışır ve API (Application Programming Interface) üzerinden haberleşir.

### Arka Yüz (Backend)
*   **Teknoloji:** Node.js üzerinde çalışan modern **NestJS** çerçevesi kullanılmıştır.
*   **Mantık:** Sunucu, gelen HTTP taleplerini (GET, POST, DELETE) karşılar. Kitapların listelenmesi, satışı, gelir metriklerinin (Metrics) güncellenmesi gibi tüm iş kuralları (Business Logic) burada gerçekleşir.
*   **Veritabanı:** **SQLite** veritabanı kullanılmıştır (TypeORM aracılığıyla). Sipariş tamamlandığında (Checkout) ilgili kitabın stoğu düşülürken, aynı anda satışın yapıldığı ayın gelir metriği otomatik olarak veritabanında artırılır.

### Ön Yüz (Frontend)
*   **Teknoloji:** Kullanıcı arayüzü **React** ile geliştirilmiş olup, hızlı ve modern bir derleyici olan **Vite** ile paketlenmektedir.
*   **Mantık:** Kullanıcı tarayıcıda bir butona bastığında (örneğin "Sepete Ekle" veya "Satın Al"), React uygulaması Backend'in sunduğu `http://localhost:3001/...` adreslerine istek atar. Sunucudan dönen yanıta göre arayüz anında güncellenir.
*   **Görselleştirme:** Satış istatistikleri sunucudan "aylık periyotlar" halinde çekilir. Gelen bu veriler, seçilen 3-6-12 aylık filtreleme kurallarına göre sıralanır ve **Recharts** kütüphanesi sayesinde grafik olarak ekrana çizilir.

## 3. Çalıştırma Akışı
1.  **Veri Talebi:** Frontend yüklendiğinde Backend'den kitapları (`/books`) ve metrikleri (`/metrics`) ister.
2.  **Etkileşim:** Kullanıcı bir kitap satın aldığında (`/books/checkout` veya `/books/:id/buy`), Backend ilgili kitabın stoğunu azaltır ve o anki ayın (`periodKey`) gelir hanesine ilgili fiyatı ekler.
3.  **Yansıma:** Satın alma işlemi başarıyla bittikten sonra Frontend verileri tekrar çeker ve hem azalan stokları hem de grafikte yükselen gelir tablosunu eşzamanlı olarak kullanıcıya gösterir.
