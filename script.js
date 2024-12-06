const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let products = [];

// uplist.txt dosyasından verileri yükleme
fetch('uplist.txt')
    .then(response => response.text())
    .then(data => {
        // Satırları ayrıştır ve ürünleri nesne listesine dönüştür
        const lines = data.split('\n');
        products = lines.map(line => {
            const parts = line.split(' - ');
            if (parts.length === 3) {
                return {
                    name: parts[0].trim(),
                    code: parts[1].trim(),
                    image: parts[2].trim()
                };
            }
        }).filter(Boolean); // Geçerli ürünleri al
    })
    .catch(error => console.error('Veri yükleme hatası:', error));

// Mesaj gönderme işlevi
sendBtn.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage('user', userMessage);
        handleUserMessage(userMessage);
        userInput.value = '';
    }
});

// Kullanıcı mesajını analiz etme
function handleUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let foundProduct = null;

    // Mesajda ürün adını veya kodunu kontrol et
    for (const product of products) {
        if (
            lowerMessage.includes(product.name.toLowerCase()) ||
            lowerMessage.includes(product.code)
        ) {
            foundProduct = product;
            break;
        }
    }

    if (foundProduct) {
        const response = `
            Bu ürün hakkında bilgi buldum: <br>
            <strong>Ürün Adı:</strong> ${foundProduct.name} <br>
            <strong>Kodu:</strong> ${foundProduct.code} <br>
            <strong>Görsel:</strong> <br>
            <img src="${foundProduct.image}" alt="${foundProduct.name}" style="max-width: 150px; border: 1px solid #ccc; margin-top: 10px;">
        `;
        appendMessage('bot', response);
    } else {
        appendMessage('bot', "Maalesef bu ürünü bulamadım. Lütfen ürün adını veya kodunu kontrol ederek tekrar deneyin.");
    }
}

// Sohbet kutusuna mesaj ekleme
function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
