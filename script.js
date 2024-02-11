

const allProductsTBody = document.querySelector("#allProducts tbody")
const searchProduct = document.getElementById("searchProduct")
const btnAdd = document.getElementById("btnAdd")
const closeDialog = document.getElementById("closeDialog")


function Product(id, name, brand ,price, rating){
    this.id = id
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
    for(let i = 0; i < products.length;i++){ // TODO add a matches function
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
    const htmlElementetSomViHarKlickatPa = event.target
    console.log(htmlElementetSomViHarKlickatPa.dataset.productid)
    const product = products.find(p=> p.id === htmlElementetSomViHarKlickatPa.dataset.productid)
    productName.value = product.name
    brand.value = product.brand
    price.value = product.price
    rating.value = product.rating
    editingProduct = product

    MicroModal.show('modal-1');

}

closeDialog.addEventListener("click",async (ev)=>{
    ev.preventDefault()
    let url = ""
    let method = ""
    console.log(url)
    var o = {
        "name" : productName.value,
        "brand" : brand.value,
        "price" : price.value,
        "rating": rating.value
        }

    if(editingProduct != null){
        o.id = editingProduct.id;
        url =  "http://localhost:3000/api/products/" + o.id
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
          body: JSON.stringify(o)                
    })

    let json = await response.json()

    products = await fetchProducts()
    updateTable()
    MicroModal.close('modal-1');
})

btnAdd.addEventListener("click",()=>{
    productName.value = ""
    price.value = 0
    rating.value = 0
    editingProduct = null

    MicroModal.show('modal-1');
    
})


const updateTable = function(){
    // while(allPlayersTBody.firstChild)
    //     allPlayersTBody.firstChild.remove()
    allProductsTBody.innerHTML = ""

    // först ta bort alla children
    for(let i = 0; i < products.length;i++) { // hrmmm you do foreach if you'd like, much nicer! 
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
        btn.dataset.productid=products[i].id
        td.appendChild(btn)
        tr.appendChild(td)


        btn.addEventListener("click",onClickProduct);

        // btn.addEventListener("click",function(){
        //       alert(players[i].name)  
        //       //                      detta funkar fast med sk closures = magi vg
        // })


        allProductsTBody.appendChild(tr)
    }

    // innerHTML och backticks `
    // Problem - aldrig bra att bygga strängar som innehåller/kan innehålla html
    //    injection
    // for(let i = 0; i < players.length;i++) { // hrmmm you do foreach if you'd like, much nicer! 
    //                                         // I will show you in two weeks
    //                                         //  or for p of players     
    //     let trText = `<tr><th scope="row">${players[i].name}</th><td>${players[i].jersey}</td><td>${players[i].position}</td><td>${players[i].team}</td></tr>`
    //     allPlayersTBody.innerHTML += trText
    // }
    // createElement
}




updateTable()





MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
   
    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: false, // [7]
    awaitOpenAnimation: false, // [8]
    awaitCloseAnimation: false, // [9]
    debugMode: true // [10]
  });




  
