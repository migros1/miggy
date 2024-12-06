// uplist.txt dosyasından ürün verilerini çekme
async function loadProductData() {
    try {
        const response = await fetch('uplist.txt');
        const text = await response.text();
        const lines = text.split('\n');
        lines.forEach(line => {
            if (line.trim() !== '') {
                const [productName, productCode, imageUrl] = line.split(' - ');
                displayProduct(productName.trim(), productCode.trim(), imageUrl.trim());
            }
        });
    } catch (error) {
        console.error('Ürün verileri yüklenirken hata oluştu:', error);
    }
}

function displayProduct(name, code, imageUrl) {
    const productInfo = document.getElementById('product-info');
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `<img src="${imageUrl}" alt="${name}" style="width: 50px; height: 50px;"><div>${name} - Kasa Kodu: ${code}</div>`;
    productInfo.appendChild(productDiv);
}

// API'den veri çekme
async function fetchChatResponse(message) {
    try {
        const response = await fetch(`https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(message)}&model=gpt-4o-mini`);
        const data = await response.json();
        return data.answer;
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