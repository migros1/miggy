// uplist.txt dosyasından verileri çek ve işleme
fetch('uplist.txt')
  .then(response => {
    if (!response.ok) throw new Error('Dosya yüklenemedi');
    return response.text();
  })
  .then(data => {
    const lines = data.split('\n');
    const products = lines.map(line => {
      const [product, code, imageUrl] = line.split(' - ');
      return { product, code, imageUrl };
    });

    // Form gönderildiğinde arama işlevi
    const form = document.getElementById('query-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const query = document.getElementById('query').value.toLowerCase();
      const resultContainer = document.getElementById('result');
      resultContainer.innerHTML = '';

      const matchedProducts = products.filter(item =>
        item.product && item.product.toLowerCase().includes(query)
      );

      if (matchedProducts.length > 0) {
        matchedProducts.forEach(item => {
          const productDiv = document.createElement('div');
          productDiv.innerHTML = `
            <p><strong>Ürün:</strong> ${item.product}</p>
            <p><strong>Kodu:</strong> ${item.code}</p>
            <img src="${item.imageUrl}" alt="${item.product}" />
          `;
          resultContainer.appendChild(productDiv);
        });
      } else {
        resultContainer.innerHTML = '<p>Sonuç bulunamadı.</p>';
      }
    });
  })
  .catch(error => console.error('Hata:', error));
