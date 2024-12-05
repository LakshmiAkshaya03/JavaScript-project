
const productContainer = document.querySelector(".products");
let allProducts = [];
function fetchProducts() {
    fetch("https://fakestoreapi.com/products")
        .then((resp) => resp.json())
        .then((data) => {
            allProducts = data; 
            displayProducts(allProducts);
            setupCategoryFilters() 
        })
        .catch((err) => console.log("Error occurred while fetching data", err));
}
function displayProducts(filteredProducts) {
    productContainer.innerHTML = ""; 
    filteredProducts.forEach((product) => {
        const reducedTitle = product.title.slice(0, 20) + "...";
        const reducedDescription = product.description.slice(0, 60) + "...";

        const productCard = `
        <div class="col col-lg-4 col-md-6 col-12">
            <div class="card">
                <img src=${product.image} class="card-img-top p-2 " alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${reducedTitle}</h5>
                    <p class="card-text">${reducedDescription}</p>
                </div>
                <ul class="list-group list-group-flush text-center">
                    <li class="list-group-item fs-5 fw-lighter">$${product.price.toFixed(2)}</li>
                </ul>
                <div class="card-body text-center">
                    <a href="details-page.html?id=${product.id}" class="btn btn-dark">Details</a>
                    <button class="btn btn-dark " onclick="addToCart(${product.id},1)">Add to Cart</button>
                </div>
            </div>
        </div>`;
        productContainer.insertAdjacentHTML("beforeend", productCard);
    });
}


function setupCategoryFilters() {
    document.querySelectorAll("button[data-category]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); 
            const categoryOfProduct = button.getAttribute("data-category");

            const filteredProducts =
                categoryOfProduct === "all"
                    ? allProducts 
                    : allProducts.filter((product) =>
                          product.category.toLowerCase() === categoryOfProduct.toLowerCase()
                      );

            displayProducts(filteredProducts); 
        });
    });
}

fetchProducts();

function fetchSingleProduct() {
    const productId = new URLSearchParams(window.location.search).get('id');
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((resp) => resp.json())
        .then((product) => singleProductHandler(product));
}

function singleProductHandler(product) {
    const productDetails = document.querySelector('.product-details');
    productDetails.innerHTML = `
    <div class="product-container d-flex">
    <div class="product-img mt-3">
        <img src="${product.image}" alt="product-image" class="ms-5">
    </div>
    <div class="product-info mt-4 ms-3">
        <h3 class="fs-3 text-secondary">${product.category.toUpperCase()}</h3>
        <p class="fs-1 fw-lighter">${product.title}</p>
        <p class="fw-lighter">${product.rating.rate} <i class="fa-solid fa-star"></i></p>
        <div class="product-price fs-3 text-body-tertiary fw-lighter">$${product.price}</div>
        <div class="product-description fw-normal text-body-secondary fs-6 mt-2 text-wrap">${product.description}</div>
        <div class="product-button mt-3">
            <button class="btn btn-dark" onclick="addToCart(${product.id},1)">Add to Cart</button>
            <a href="cart-page.html" class="btn btn-dark ms-3 ps-2 pe-2">Go to Cart</a>
        </div>
    </div>
</div>
`;
}


async function fetchProductsforDetails() {
    try {
      const response = await fetch('https://fakestoreapi.com/products'); 
      const products = await response.json();
      displaySliderProducts(products);
      startAutoScroll(); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  

  function displaySliderProducts(products) {
    const carousel = document.getElementById('carousel');
    products.forEach(product => {
      const productCard = `
      <div class="product-card mx-2 mt-3" style="width: 18rem; ">
            <img src="${product.image}" class="card-img-top p-2" alt="${product.title}">
            <h5 class="card-title">${product.title.length > 15 ? product.title.slice(0, 15) + "..." : product.title}</h5>
            <div class="d-flex mt-2">
                <a href="details-page.html?id=${product.id}" class="btn btn-dark ">Details</a>
                <button class="btn btn-dark ms-2 " onclick="addToCart(${product.id},1)">Add to Cart</button>
            </div>
      `;
      carousel.innerHTML += productCard;
    });
  
   
    const clone = carousel.innerHTML;
    carousel.innerHTML += clone;
  }
  
  
  function startAutoScroll() {
    const carousel = document.getElementById('carousel');
    let scrollPosition = 0;
  
    setInterval(() => {
      scrollPosition += 2; 
      carousel.scrollLeft = scrollPosition;
  
      
      if (scrollPosition >= carousel.scrollWidth / 2) {
        scrollPosition = 0;
      }
    }, 40); 
  }

 

fetchSingleProduct();
fetchProductsforDetails();


async function fetchProductById(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Error fetching product with ID: ${productId}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

function addToCart(productId) {
    fetchProductById(productId).then((product) => {
        if (!product) return; 
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1; 
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart)); 
        updateCartCount(); 
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartButton = document.querySelector('.cartCount');
    cartButton.innerHTML = `
        <i class="fa-solid fa-cart-shopping"></i> Cart 
        <span class="cartQtyCount text-black">(${totalQuantity})</span>
    `;
}



function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemListContainer = document.querySelector('.item-list');
    const totalProductsEl = document.getElementById('total-products'); 
    const totalPriceEl = document.getElementById('total-price'); 
    const totalAmountEl = document.getElementById('total-amount');
    const cartDataContainer = document.querySelector('.cartDataOfProducts');

    if (!itemListContainer || !cartDataContainer) return; 

    itemListContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartDataContainer.innerHTML = `
            <div class="container text-center mt-5 bg-body-secondary p-4">
                <h1 class="fw-lighter fs-4 fs-md-3 fs-lg-2 mt-3">Your Cart is Empty</h1>
                <a href="index.html" class="btn btn-outline-dark mt-3 mb-4">
                    <i class="fa-solid fa-arrow-left"></i> Continue Shopping
                </a>
            </div>`;
        if (totalProductsEl && totalPriceEl) {
            totalProductsEl.textContent = 0;
            totalPriceEl.textContent = `$0.00`;
        }
        totalAmountEl.textContent = `$30.00`;
        return;
    }    

    let totalProducts = 0;
    let subtotal = 0;
    cart.forEach((item) => {
        totalProducts += item.quantity;
        subtotal += item.price * item.quantity;

        const itemRow = document.createElement('div');
        
        itemRow.innerHTML = `
        <div class="row mb-3">
        <div class="cart-list col-lg-8 col-md-12 col-12 d-flex mb-3">
          <img src="${item.image}" class="ms-4">
          <h6 class="text-black mt-5 ms-5 text-wrap ps-5">${item.title}</h6>
        </div>
        <div class="col-lg-4 col-md-12 col-12 text-end mb-3 d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-outline-dark me-3 fs-5" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="fs-5">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-dark ms-3 fs-5 me-3" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <p class="pt-2 fs-6 fw-medium text-end pe-5">${item.quantity} x $${item.price.toFixed(2)}</p>
      <hr>
      
        `;
        itemListContainer.appendChild(itemRow);
    });

    if (totalProductsEl && totalPriceEl) {
        totalProductsEl.textContent = totalProducts;
        totalPriceEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    totalAmountEl.textContent = `$${(subtotal + 30).toFixed(2)}`; 
}


function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            cart = cart.filter((item) => item.id !== productId); 
        }
        localStorage.setItem('cart', JSON.stringify(cart)); 
        renderCartItems();
        updateCartCount(); 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    const itemListContainer = document.querySelector('.item-list');
    if (itemListContainer) {
        renderCartItems();
    }
});