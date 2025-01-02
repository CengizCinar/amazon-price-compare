# Amazon Price Compare Chrome Extension

Bu Chrome uzantısı, Amazon ürün sayfalarındaki ürünlerin fiyatlarını Idealo'daki fiyatlarla karşılaştırmanıza olanak tanır.

## Özellikler

- Amazon ürün sayfalarında otomatik ASIN tespiti
- Keepa API ile EAN numarası çıkarma
- Idealo.de, Idealo.fr ve Idealo.it üzerinden fiyat karşılaştırma
- Gerçek zamanlı fiyat gösterimi
- Kullanıcı dostu arayüz

## Kurulum

### Gereksinimler

- Python 3.x
- Flask
- Flask-CORS
- Chrome Tarayıcı

### Python Bağımlılıkları

pip install flask flask-cors

### Sunucu Kurulumu

1. Projeyi klonlayın:
git clone https://github.com/CengizCinar/amazon-price-compare.git
cd amazon-price-compare

2. Flask sunucusunu başlatın:
cd scripts
python server.py

Sunucu varsayılan olarak http://localhost:5001 adresinde çalışacaktır.

### Chrome Extension Kurulumu

1. Chrome tarayıcısında `chrome://extensions/` adresine gidin
2. Sağ üst köşeden "Developer mode"u açın
3. "Load unpacked" butonuna tıklayın
4. Projenin ana klasörünü seçin

## Kullanım

1. Sunucuyu başlatın:
cd amazon-price-compare/scripts
python server.py

2. Herhangi bir Amazon ürün sayfasına gidin
3. Ürün fiyatlarının yanında karşılaştırma kutusu görünecektir
4. Farklı ülkelerdeki Idealo fiyatlarını görebilirsiniz

## Proje Yapısı

amazon-price-compare/
│
├── manifest.json         # Extension ayarları
├── background.js        # Background script
├── content.js          # Content script
│
├── styles/
│   └── content.css     # UI stilleri
│
├── icons/
│   ├── icon48.png     # Extension ikonları
│   └── icon128.png
│
└── scripts/
    ├── server.py      # Flask sunucusu
    └── keepa2.py      # Keepa API işlemleri

## Dosya Açıklamaları

- `manifest.json`: Extension'ın temel ayarları ve izinleri
- `background.js`: Arka planda çalışan ve API isteklerini yöneten script
- `content.js`: Amazon sayfasında çalışan ve UI'ı oluşturan script
- `server.py`: EAN numaralarını çeken Flask sunucusu
- `keepa2.py`: Keepa API entegrasyonu
- `content.css`: UI stilleri

## API Kullanımı

### Keepa API

Keepa API'yi kullanmak için bir API anahtarı gereklidir. API anahtarını `keepa2.py` dosyasında ayarlayın:

api_key = "your-keepa-api-key"

### Endpoints

- `/get_ean` (POST): ASIN'den EAN numarası almak için kullanılır
  - Request: `{ "asin": "B095KTKHJY" }`
  - Response: `{ "ean": "1234567890123" }`

## Hata Ayıklama

1. Chrome DevTools'u açın (F12)
2. Console sekmesini kontrol edin
3. Network sekmesinde API isteklerini izleyin

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

Cengiz Çınar - [GitHub](https://github.com/CengizCinar)

Proje Linki: [https://github.com/CengizCinar/amazon-price-compare](https://github.com/CengizCinar/amazon-price-compare) 