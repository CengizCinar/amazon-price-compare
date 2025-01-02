// ASIN'i URL'den al
function getASIN() {
    console.log('URL kontrol ediliyor...');
    const match = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
    if (match) {
        console.log('ASIN bulundu:', match[1]);
        return match[1];
    }
    console.log('ASIN bulunamadı');
    return null;
}

// EAN'i server'dan al
async function getEAN(asin) {
    console.log('EAN alınıyor, ASIN:', asin);
    
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'getEAN', asin: asin },
                response => {
                    if (chrome.runtime.lastError) {
                        console.error('Chrome runtime error:', chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    } else {
                        console.log('Background yanıtı:', response);
                        resolve(response);
                    }
                }
            );
        });

        if (response.error) {
            throw new Error(response.error);
        }

        console.log('EAN alındı:', response.ean);
        return response.ean;
        
    } catch (error) {
        console.error('EAN alma hatası:', error);
        return null;
    }
}

// Idealo'dan fiyatları çek
async function getPrices(ean) {
    // Doğrudan Idealo'ya istek yapmak yerine background.js üzerinden yapmalıyız
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'getPrices', ean: ean },
                response => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
        return response.prices || [];
    } catch (error) {
        console.error('Fiyat alma hatası:', error);
        return [];
    }
}

// Fiyat karşılaştırma UI'ını oluştur
function createPriceComparison(prices) {
    console.log('UI oluşturuluyor, prices:', prices);
    
    const container = document.createElement('div');
    container.className = 'price-comparison-container';
    
    // Buy box'ı farklı selektörlerle dene
    const possibleSelectors = [
        '#desktop_buybox',
        '#buybox',
        '.a-box-group',
        '#rightCol',
        '#centerCol'
    ];
    
    let targetElement = null;
    for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            targetElement = element;
            break;
        }
    }
    
    if (targetElement) {
        console.log('Hedef element bulundu:', targetElement);
        targetElement.parentNode.insertBefore(container, targetElement);
    } else {
        console.warn('Hedef element bulunamadı, body\'e ekleniyor');
        document.body.appendChild(container);
    }
    
    // UI içeriğini oluştur
    const header = document.createElement('div');
    header.className = 'price-comparison-header';
    header.textContent = 'Fiyat Karşılaştırma';
    container.appendChild(header);
    
    if (prices.length === 0) {
        const noPrice = document.createElement('div');
        noPrice.className = 'error-message';
        noPrice.textContent = 'Fiyat bulunamadı';
        container.appendChild(noPrice);
    } else {
        prices.forEach(({site, price}) => {
            const item = document.createElement('div');
            item.className = 'price-item';
            
            const siteSpan = document.createElement('span');
            siteSpan.className = 'price-site';
            siteSpan.textContent = site;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'price-value';
            priceSpan.textContent = price;
            
            item.appendChild(siteSpan);
            item.appendChild(priceSpan);
            container.appendChild(item);
        });
    }
    
    console.log('UI oluşturma tamamlandı');
}

// Ana fonksiyon
async function init() {
    console.log('Extension başlatılıyor...');
    try {
        const asin = getASIN();
        if (!asin) {
            console.log('ASIN bulunamadı, çıkılıyor...');
            return;
        }
        
        console.log('EAN alınıyor...');
        const ean = await getEAN(asin);
        if (!ean) {
            console.error('EAN alınamadı');
            return;
        }
        
        console.log('EAN bulundu:', ean);
        console.log('Fiyatlar çekiliyor...');
        const prices = await getPrices(ean);
        console.log('Fiyatlar:', prices);
        
        if (prices.length > 0) {
            console.log('UI oluşturuluyor...');
            createPriceComparison(prices);
        } else {
            console.log('Fiyat bulunamadı');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}

// Sayfa yüklendiğinde başlat
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}

// URL değişikliklerini izle
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        init();
    }
}).observe(document, {subtree: true, childList: true}); 