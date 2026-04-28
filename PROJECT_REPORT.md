# Proje Genel Değerlendirme Raporu

## 1. Mimari ve Teknolojik Altyapı

Proje, modern bir Full-Stack (İstemci-Sunucu) mimarisi üzerine inşa edilmiştir:

*   **Backend (Sunucu):** NestJS (TypeScript tabanlı Node.js framework). Veritabanı işlemleri için TypeORM kullanılmış ve veri saklama amacıyla hafif, taşınabilir bir çözüm olan SQLite tercih edilmiştir. API RESTful standartlarında çalışmaktadır.
*   **Frontend (İstemci):** React kullanılarak geliştirilmiş olup, hızlı derleme (build) süreçleri için Vite tercih edilmiştir. Grafik ve veri görselleştirme kısımları Recharts kütüphanesi üzerine kurulmuştur. React Router ile sayfalar arası geçiş sağlanmıştır.

## 2. Temel Modüller ve İşlevler

Sistem temelde bir "Kitap Satış Pisti / E-Ticaret ve Yönetim Paneli" özellikleri taşır:
*   **Yetkilendirme (Auth & Users):** Kullanıcı giriş-çıkış mekanizması, rol (müsiteri/admin) tabanlı erişim denetimi.
*   **Vitrin ve Sepet İşlemleri:** Ana sayfada kitapların listelenmesi, stok durumuna göre sepete ekleme ve sipariş tamamlama işlemleri.
*   **Yönetim Paneli (Dashboard):** 
    *   Yöneticilerin (Admin) yeni kitap eklemesi, stok yenilemesi ve kitapları silmesi.
    *   Geçmiş satış performansının 3, 6 ve 12 aylık filtrelerle bar, çizgi veya pasta grafiği ile analiz edilebilmesi.
*   **Database Seeder (Veri Yönetimi):** Sistemin tek tıkla test verileriyle doldurulabilmesi (Junk State) veya temiz, standart haline getirilmesi (Golden State).

## 3. Son Geliştirmeler ve Hata Çözümleri

Yakın zamanda sistemde bazı kritik mantıksal hatalar düzeltilmiş ve yeni özellikler eklenmiştir:
*   **Grafik Tarih Filtreleme Düzeltmesi:** Önceden her yıl için grafiği "Ocak" ayından başlatma hatası bulunuyordu. Veritabanına `periodKey` ve `label` metadataları eklenerek sistem hesaplamaları *Rolling Month* (içinde bulunulan ay baz alınarak geriye doğru hesaplama) mantığına kaydırıldı. Artık 3, 6 ve 12 aylık filtrelemeler kesintisiz çalışmaktadır.
*   **Test Verisi (Junk Data) Çözümleri:** Rastgele test verisi üretilirken grafiğin bu veriyi bar chart (Monthly Sales) olarak gösterebilmesi için eksik kalan test `type` bilgisi NestJS tarafında düzeltildi.
*   **Kitap Silme Özelliği:** Yönetim paneline tablodaki ürünleri tamamen kaldırabilmek adına `DELETE` REST uç noktası entegre edilip önyüze de işlevsel bir "Sil" butonu eklendi. (Onay kutusu korumalıdır).
*   **Kullanıcı Deneyimi:** Yönetim paneline entegre edilmiş ve kazara veri silinmesine sebep olabilecek gizli bir `Shift + R` kombinasyonu koddan güvenlik/UX sebebiyle temizlendi.


