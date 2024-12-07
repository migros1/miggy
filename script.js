// uplist.txt dosyasından verileri çek ve işleme
fetch('https://migros1.github.io/miggy/uplist.txt')
  .then(response => {
    if (!response.ok) throw new Error('Dosya yüklenemedi');
    return response.text();
  })
  .then(data => {
    const lines = data.split('\n');
    let products = lines.map(line => {
      const [product, code, imageUrl, infoLink] = line.split(' - ');
      return { product, code, imageUrl, infoLink };
    });

    // Ürün kodları "undefined" olan veya ürün adı olmayan ürünleri filtreleme
    products = products.filter(item => item.code !== 'undefined' && item.product);

    // Ürünleri ürün adına göre sırala
    products.sort((a, b) => a.product.localeCompare(b.product));

    let currentPage = 1;
    const productsPerPage = 12;
    let filteredProducts = [...products];

    function displayProducts() {
      const productList = document.querySelector('.product-list');
      const loadingSpinner = document.querySelector('.loading-spinner');
      if (!productList || !loadingSpinner) return; // Eğer ürün listesi veya yükleme göstergesi bulunamazsa işlemi durdur

      productList.innerHTML = '';
      loadingSpinner.style.display = 'none';

      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      paginatedProducts.forEach(item => {
        if (item.product) {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');
          productCard.innerHTML = `
            <div class="product-image">
              <img src="${item.imageUrl}" alt="${item.product}">
            </div>
            <div class="product-info">
              <div class="product-name">${item.product}</div>
              <div class="product-code">Kod: ${item.code || ''}</div>
              <a href="${item.infoLink}" target="_blank" class="migros-link">Migros ile bak</a>
            </div>
          `;

          productList.appendChild(productCard);
        }
      });

      // Sayfalama bilgileri
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      document.getElementById('current-page').textContent = currentPage;
      document.getElementById('total-pages').textContent = totalPages;
      document.getElementById('prev-page').disabled = currentPage === 1;
      document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    // Önceki ve Sonraki sayfa butonları
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayProducts();
      }
    });

    document.getElementById('next-page').addEventListener('click', () => {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
      }
    });

    // Form gönderildiğinde arama işlevi
    const queryInput = document.getElementById('query');
    queryInput.addEventListener('input', () => {
      const query = queryInput.value.toLowerCase();
      filteredProducts = products.filter(item =>
        item.product && item.product.toLowerCase().includes(query)
      );
      currentPage = 1;
      displayProducts();
    });

    // Stok kontrol penceresi
    const modal = document.getElementById('stock-control-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function showStockControlModal(infoLink) {
      if (!localStorage.getItem('stockControlModalClosed')) {
        modal.style.display = 'block';
        modalCloseBtn.addEventListener('click', () => {
          modal.style.display = 'none';
          localStorage.setItem('stockControlModalClosed', 'true');
        });
      } else {
        window.open(infoLink, '_blank');
      }
    }

    // Üste çekince listeyi yenileme ve güncelleme
    const productListContainer = document.querySelector('.product-list-container');
    const productList = document.querySelector('.product-list');
    const loadingSpinner = document.querySelector('.loading-spinner');

    let isRefreshing = false;
    let refreshTimeout;
    let pullDistance = 0;
    const pullThreshold = 100; // Çekme mesafesi eşiği

    productListContainer.addEventListener('touchstart', (event) => {
      if (window.pageYOffset === 0) {
        productListContainer.classList.add('refreshing');
        pullDistance = 0;
      }
    });

    productListContainer.addEventListener('touchmove', (event) => {
      if (window.pageYOffset === 0) {
        pullDistance = event.touches[0].clientY;
        productListContainer.style.transform = `translateY(${pullDistance}px)`;
      }
    });

    productListContainer.addEventListener('touchend', () => {
      if (window.pageYOffset === 0 && pullDistance >= pullThreshold) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTimeout = setTimeout(() => {
            fetch('https://migros1.github.io/miggy/uplist.txt')
              .then(response => {
                if (!response.ok) throw new Error('Dosya yüklenemedi');
                return response.text();
              })
              .then(data => {
                const lines = data.split('\n');
                products = lines.map(line => {
                  const [product, code, imageUrl, infoLink] = line.split(' - ');
                  return { product, code, imageUrl, infoLink };
                });

                // Ürün kodları "undefined" olan veya ürün adı olmayan ürünleri filtreleme
                products = products.filter(item => item.code !== 'undefined' && item.product);

                // Ürünleri ürün adına göre sırala
                products.sort((a, b) => a.product.localeCompare(b.product));

                filteredProducts = [...products];
                currentPage = 1;
                displayProducts();
                productListContainer.classList.remove('refreshing');
                productListContainer.style.transform = 'translateY(0)';
                isRefreshing = false;
              })
              .catch(error => {
                console.error('Hata:', error);
                productListContainer.classList.remove('refreshing');
                productListContainer.style.transform = 'translateY(0)';
                isRefreshing = false;
              });
          }, 1000); // 1 saniye bekledikten sonra güncelleme yap
        }
      } else {
        productListContainer.style.transform = 'translateY(0)';
      }
    });

    displayProducts();
  })
  .catch(error => console.error('Hata:', error));