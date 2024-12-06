// uplist.txt verisini simüle ediyoruz (veri örneği):
const products = [
    { name: "Domates KG.", code: "114", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp2EbIXi4ND5Yxe744Tq_e9DTLjser26EhPyLoBnJhWFyokYTVUgrz1UM&s=10" },
    { name: "Armut Santa Maria", code: "4", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwqCDf-RRhswOE2X8jnGOSG0VpPdDvLUrpw8iIDqj-0xi6CQHgrO3-CDc&s=10" }
];

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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
