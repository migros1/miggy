// API'den veri çekme
async function fetchChatResponse(message) {
    try {
        const response = await fetch(`https://darkness.ashlynn.workers.dev/chat/?prompt=${encodeURIComponent(message)}&model=gpt-4o-mini`);
        const data = await response.json();
        
        console.log('API Yanıtı:', data);  // Yanıtı konsola yazdırarak kontrol et
        
        // API yanıtında doğru anahtarı kullanarak yanıtı al
        if (data.answer) {
            return data.answer;
        } else if (data.response) {
            return data.response; // Yanıt burada olabilir
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