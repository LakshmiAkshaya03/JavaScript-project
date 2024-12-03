
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

        const itemList=document.querySelector('.item-list')
        const totalItems=document.querySelector('#totalItems')
        const subtotal=document.querySelector('#subtotal')
        const shipping=document.querySelector('#shipping')
        const totalAmount=document.querySelector('#totalAmount')
        const cartQtyCount=document.querySelector('.cartQtyCount')


        let cartData=[]
        function addToCart(Id,Quantity){
            console.log(Id,Quantity);
       

        let productArr={ID:Id,Quantity:Quantity}
        cartData.push(productArr)
        let totalQnty=0
        cartData.forEach((ele)=>{
            totalQnty+=ele.Quantity
        })
   
        cartQtyCount.innerText=totalQnty
    }

        









