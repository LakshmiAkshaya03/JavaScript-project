
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

// Add to Cart
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

    // Update the text in the cart button
    const cartButton = document.querySelector('.cartCount');
    cartButton.innerHTML = `
        <i class="fa-solid fa-cart-shopping"></i> Cart 
        <span class="cartQtyCount text-black">(${totalQuantity})</span>
    `;
}



function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemListContainer = document.querySelector('.item-list');
    const totalItemsEl = document.getElementById('total-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalAmountEl = document.getElementById('total-amount');
    const cartDataContainer = document.querySelector('.cartDataOfProducts');

    if (!itemListContainer || !cartDataContainer) return; 

    itemListContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartDataContainer.innerHTML = `
            <div class="text-center">
                <h3>Your Cart is Empty</h3>
                <a href="index.html" class="btn btn-dark mt-3">Continue Shopping</a>
            </div>`;
        return;
    }

    let subtotal = 0;
    cart.forEach((item) => {
        subtotal += item.price * item.quantity;

        const itemRow = document.createElement('div');
        itemRow.className = 'row mb-3';
        itemRow.innerHTML = `
            <div class="cart-list col-8 d-flex mb-3 ">
                <img src="${item.image}" class="ms-2">
                <h6 class="text-black  mt-5 ms-5 text-wrap ps-5">${item.title}</h6>
            </div>
            <div class="col-4 text-end  mb-3">
                <button class="btn btn-sm btn-outline-dark me-5  mt-4" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="me-5 mt-4 fs-5" >${item.quantity}</span>
                <button class="btn btn-sm btn-outline-dark  mt-4" onclick="updateQuantity(${item.id}, 1)">+</button>
                <p class="pt-5 fs-6 fw-medium pe-5">${item.quantity} x $${item.price}</p>
                </div>
            </div>
            <hr>
        `;
        itemListContainer.appendChild(itemRow);
    });

    totalItemsEl.textContent = cart.length;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
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
