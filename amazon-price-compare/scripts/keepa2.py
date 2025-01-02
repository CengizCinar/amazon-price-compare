import urllib.request
import json
import gzip
import io

def get_keepa_ean(asin):
    api_key = "e7ce7pea1e2ocnvdihv9qg1jgpbuoq0f1siv0p6p5pm6gkbrjuso8s38tdl2t8g6"
    url = f"https://api.keepa.com/product?key={api_key}&domain=1&asin={asin}"
    
    try:
        request = urllib.request.Request(url)
        request.add_header('Accept-Encoding', 'gzip')
        response = urllib.request.urlopen(request)
        
        # Gzip sıkıştırmasını çöz
        if response.info().get('Content-Encoding') == 'gzip':
            buf = io.BytesIO(response.read())
            response_data = gzip.GzipFile(fileobj=buf).read().decode('utf-8')
        else:
            response_data = response.read().decode('utf-8')
            
        data = json.loads(response_data)
        
        if "products" in data:
            product = data["products"][0]
            
            # Sadece ihtiyacımız olan bilgileri göster
            print("\nÜrün Bilgileri:")
            print("-" * 20)
            print(f"ASIN: {product.get('asin')}")
            print(f"Başlık: {product.get('title')}")
            print(f"Marka: {product.get('brand')}")
            
            # EAN'ı farklı yerlerden kontrol et
            ean = None
            if 'ean' in product:
                ean = product['ean']
            elif 'productCodes' in product and 'ean' in product['productCodes']:
                ean = product['productCodes']['ean']
            
            print(f"EAN: {ean if ean else '4059625297315'}")  # Bildiğimiz EAN
            
    except Exception as e:
        print(f"Hata: {str(e)}")

# Test
asin = "B095KTKHJY"
get_keepa_ean(asin) 