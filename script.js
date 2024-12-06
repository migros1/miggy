const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let products = [];

// uplist.txt'den verileri yükleme
fetch('uplist.txt')
    .then(response => response.text())
    .then(data => {
        // Satır satır ayrıştırıyoruz
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
        }).filter(Boolean); // Geçerli ürünleri filtrele
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

    // Mesajda geçen ürünleri arıyoruz
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
        appendMessage('bot', `Ürün: ${foundProduct.name} <br> Kod: ${foundProduct.code} <br><img src="${foundProduct.image}" alt="${foundProduct.name}" style="max-width: 100px;">`);
    } else {
        appendMessage('bot', "Maalesef bu ürünü bulamadım. Daha detaylı bir bilgi sağlayabilir misiniz?");
    }
}

// Mesajı sohbet kutusuna ekleme
function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
