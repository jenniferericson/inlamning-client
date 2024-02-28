

const allProductsTBody = document.querySelector("#allProducts tbody")
const searchProduct = document.getElementById("searchProduct")
const btnAdd = document.getElementById("btnAdd")
const closeDialog = document.getElementById("closeDialog")


function Product(productId, name, brand ,price, rating){
    this.productId = productId
    this.name = name
    this.brand = brand
    this.price = price
    this.rating = rating
    this.visible = true
    this.matches = function(searchFor){
        return  this.name.toLowerCase().includes(searchFor) || 
                this.price.toLowerCase().includes(searchFor) || 
                this.rating.toLowerCase().includes(searchFor)        
    }
}

async function fetchProducts(){
    return await((await fetch('http://localhost:3000/api/products')).json())
}

let products =  await fetchProducts()

searchProduct.addEventListener("input", function() {
    const searchFor = searchProduct.value.toLowerCase() 
    for(let i = 0; i < products.length;i++){ 
        if(products[i].matches(searchFor)){
            products[i].visible = true                            
        }else{
            products[i].visible = false 
        }
    }
    updateTable()

});


const createTableTdOrTh = function(elementType,innerText){
    let element = document.createElement(elementType)
    element.textContent = innerText
    return element
}


const productName = document.getElementById("productName")
const brand = document.getElementById("brand")
const price = document.getElementById("price")
const rating = document.getElementById("rating")

let editingProduct = null

const onClickProduct = function(event){
    const clickedElement = event.target
    console.log(clickedElement.dataset.productId)
    console.log(clickedElement)
    const product = products.find(p=> p.id == clickedElement.dataset.productId)
    console.log(product)
    productName.value = product.name
    brand.value = product.brand
    price.value = product.price
    rating.value = product.rating
    editingProduct = product
    console.log(editingProduct)
    MicroModal.show('modal-1');

}

closeDialog.addEventListener("click",async (ev)=>{
    MicroModal.close('modal-1');

    ev.preventDefault()
    let url = ""
    let method = ""
    console.log(url)
    let product = {
        "name" : productName.value,
        "brand" : brand.value,
        "price" : price.value,
        "rating": rating.value
        }

    if(editingProduct != null){
        product.productId = editingProduct.id;
        url =  "http://localhost:3000/api/products/" + product.productId
        method = "PUT"
    }else{
        url =  "http://localhost:3000/api/products"
        method = "POST"
    }

    let response = await fetch(url,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: method,
          body: JSON.stringify(product)                
    })

    let json = await response.json()

    products = await fetchProducts()
    updateTable()
})

btnAdd.addEventListener("click",()=>{
    productName.value = ""
    price.value = 0
    rating.value = 0
    editingProduct = null

    MicroModal.show('modal-1');
    
})


const updateTable = function(){
   
    allProductsTBody.innerHTML = ""

    for(let i = 0; i < products.length;i++) { 
        if(products[i].visible == false){
            continue
        }
        let tr = document.createElement("tr")

        tr.appendChild(createTableTdOrTh("th", products[i].name))
        tr.appendChild(createTableTdOrTh("td", products[i].brand ))
        tr.appendChild(createTableTdOrTh("td", products[i].price + "kr"))
        tr.appendChild(createTableTdOrTh("td", products[i].rating ))

        let td = document.createElement("td")
        let btn = document.createElement("button")
        btn.textContent = "EDIT"
        btn.dataset.productId = products[i].id
        td.appendChild(btn)
        tr.appendChild(td)


        btn.addEventListener("click",onClickProduct);

        allProductsTBody.appendChild(tr)
    }

  
}

updateTable()


MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), 
    onClose: modal => console.info(`${modal.id} is hidden`), 
   
    openTrigger: 'data-custom-open', 
    closeTrigger: 'data-custom-close', 
    openClass: 'is-open', 
    disableScroll: true, 
    disableFocus: false, 
    awaitOpenAnimation: false, 
    awaitCloseAnimation: false, 
    debugMode: true 
  });




  
