// API'den veri çekme
async function fetchChatResponse(message) {
    try {
        const response = await fetch(`https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(message)}&model=gpt-4o-mini`);
        const data = await response.json();
        
        console.log('API Yanıtı:', data);  // Yanıtı konsola yazdırarak kontrol et
        
        // Yanıtın hangi alanında cevap olduğunu kontrol et
        if (data && typeof data === 'object') {
            // Yanıtın mevcut anahtarlarını kontrol et
            for (const key in data) {
                console.log(`Anahtar: ${key}, Değer: ${data[key]}`); // Anahtarları ve değerlerini yazdır
            }
            // Doğru anahtarı bul ve cevap olarak döndür
            return data.answer || data.response || "Yanıt alınamadı.";
        } else {
            return "Yanıt alınamadı.";
        }
    } catch (error) {
        console.error('API yanıtı alınırken hata oluştu:', error);
        return "Üzgünüm, şu anda isteğinizi işleyemiyorum.";
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    input.value = '';

    fetchChatResponse(message).then(response => {
        displayChatMessage('Siz', message);
        displayChatMessage('Miggy', response);
    });
}

function displayChatMessage(sender, message) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatOutput.appendChild(messageDiv);
}

// Sayfa yüklendiğinde ürün verilerini yükle
window.onload = loadProductData;