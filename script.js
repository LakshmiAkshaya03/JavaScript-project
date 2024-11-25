
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
        const shortendDescription=ele.description.slice(0,50)+"..."
        let card = `<div class="card me-4 mb-4 h-75" >
    <img src=${ele.image} class="card-img-top w-100 h-50 p-2" alt="...">
  <div class="card-body">
    <h5 class="card-title">${shortendTitle}</h5>
    <p class="card-text">${shortendDescription}</p>
    </div>
    <ul class="list-group list-group-flush">
    <li class="list-group-item">${ele.price}</li>
  </ul>
  <div class="card-body">
    <a href="#" class="btn btn-dark">Details</a>
    <a href="#" class="btn btn-dark">Add to Cart</a>
  </div>
</div>`


parentDiv.insertAdjacentHTML("beforeend", card)
       })
    }



