
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
                    <a href="cart-page.html?id=${product.id,1}" class="btn btn-dark">Add to Cart</a>
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



