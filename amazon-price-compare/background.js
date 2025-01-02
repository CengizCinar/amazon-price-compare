// Service Worker başlatma
console.log('Background service worker başlatıldı');

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Mesaj alındı:', request);
    
    if (request.type === 'getEAN') {
        console.log('EAN isteği alındı, ASIN:', request.asin);
        
        // Mesaj kanalını açık tut
        let messageSent = false;
        
        fetch('http://localhost:5000/get_ean', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asin: request.asin })
        })
        .then(response => response.json())
        .then(data => {
            if (!messageSent) {
                messageSent = true;
                sendResponse(data);
            }
        })
        .catch(error => {
            if (!messageSent) {
                messageSent = true;
                sendResponse({ error: error.message });
            }
        });
        
        return true;  // Asenkron yanıt için
    }
    
    if (request.type === 'getPrices') {
        const sites = {
            'idealo.de': `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${request.ean}`,
            'idealo.it': `https://www.idealo.it/cat/ACCESS/accessori-per-search.html?q=${request.ean}`,
            'idealo.fr': `https://www.idealo.fr/cat/ACCESS/accessoires-sports-et-loisirs.html?q=${request.ean}`
        };
        
        Promise.all(Object.entries(sites).map(async ([site, url]) => {
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                const priceElement = doc.querySelector("div[class='sr-detailedPriceInfo__price_prime']");
                if (priceElement) {
                    return { site, price: priceElement.textContent.trim() };
                }
                return null;
            } catch (error) {
                console.error(`${site} error:`, error);
                return null;
            }
        }))
        .then(results => {
            const prices = results.filter(result => result !== null);
            sendResponse({ prices });
        })
        .catch(error => {
            sendResponse({ error: error.message });
        });
        
        return true;
    }
});

// Service worker event handlers
self.addEventListener('install', (event) => {
    console.log('Service Worker yüklendi');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker aktif');
    event.waitUntil(clients.claim());
}); 