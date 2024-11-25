
    function fetchHandler(){
        const fetchapi=fetch(' https://fakestoreapi.com/products').then((resp)=>{
            return resp.json()
        }).then((data)=>{
            dataHandler(data)
        })
    }
    fetchHandler()


    function dataHandler(data){
        console.log(data);
        
       const parentDiv = document.querySelector(".product-item-container")

       data.forEach((ele)=>{
        const shortendTitle=ele.title.slice(0,20)+"..."
        const shortendDescription=ele.description.slice(0,55)+"..."
        let card = `
        <div class="col col-lg-4 col-md-6 col-12">
        <div class="card " >
    <img src=${ele.image} class="card-img-top p-2" alt="...">
  <div class="card-body">
    <h5 class="card-title">${shortendTitle}</h5>
    <p class="card-text">${shortendDescription}</p>
    </div>
    <ul class="list-group list-group-flush text-center">
    <li class="list-group-item fs-5 fw-lighter">$${ele.price.toFixed(2)}</li>
  </ul>
  <div class="card-body text-center">
    <a href="#" class="btn btn-dark">Details</a>
    <a href="#" class="btn btn-dark">Add to Cart</a>
  </div>
  </div>

</div>`


parentDiv.insertAdjacentHTML("beforeend", card)
       })
    }



