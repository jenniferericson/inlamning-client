const productName = document.getElementById("productName");
const brand = document.getElementById("brand");
const price = document.getElementById("price");
const rating = document.getElementById("rating");

let editingProduct = null;

const onClickProduct = function(event){
    const clickedElement = event.target;
    const product = products.find(p=> p.id == clickedElement.dataset.productId);

    productName.value = product.name;
    brand.value = product.brand;
    price.value = product.price;
    rating.value = product.rating;
    editingProduct = product;

    MicroModal.show('modal-1');

};

const allSortLinks = document.getElementsByClassName('bi');
let  currentSortCol = "";
let currentSortOrder = "";
let currentPageNo = 1;
let currentPageSize = 5;
let currentQ = "";

Object.values(allSortLinks).forEach(link=>{
    link.addEventListener("click",()=>{
        currentSortCol = link.dataset.sortcol;
        currentSortOrder = link.dataset.sortorder;
        refresh();
    });  
});


const createTableTdOrTh = function(elementType,innerText){
    let element = document.createElement(elementType);
    element.textContent = innerText;
    return element;
};

const pager = document.getElementById('pager') 

function createPager(count,pageNo,currentPageSize){
    pager.innerHTML = ""
    let totalPages = Math.ceil(count / currentPageSize)
    for(let i = 1; i <= totalPages; i++){
        const li = document.createElement('li')
        li.classList.add("page-item")
        if(i == pageNo){
            li.classList.add("active")
        }
        const a = document.createElement('a')
        a.href="#"
        a.innerText = i
        a.classList.add("page-link")
        li.appendChild(a)
        a.addEventListener("click",()=>{
            
            currentPageNo = i
            refresh()
        })
        pager.appendChild(li)
    }
}


async function refresh(){
    let offset = (currentPageNo - 1) * currentPageSize
    let url = "http://localhost:3000/api/products?sortCol=" 
        + currentSortCol + "&sortOrder=" + currentSortOrder +
        "&q=" + currentQ + "&offset=" + offset + "&limit=" + currentPageSize

    const response = await fetch(url,{
        headers:{
            'Accept': 'application/json'
        }
    });  

    const {result, total} = await response.json();
    let count = total;
    const products = result

    const allProductsTBody = document.querySelector("#allProducts tbody");
    allProductsTBody.innerHTML = "";

    for(let i = 0; i < products.length;i++) { 
        if(products[i].visible == false){
            continue
        };

        let tr = document.createElement("tr");

        tr.appendChild(createTableTdOrTh("th", products[i].name));
        tr.appendChild(createTableTdOrTh("td", products[i].brand ));
        tr.appendChild(createTableTdOrTh("td", products[i].price + "kr"));
        tr.appendChild(createTableTdOrTh("td", products[i].rating ));

        let td = document.createElement("td");
        let btn = document.createElement("button");
        btn.textContent = "EDIT";
        btn.dataset.productId = products[i].id;
        td.appendChild(btn);
        tr.appendChild(td);

        btn.addEventListener("click",onClickProduct);

        allProductsTBody.appendChild(tr);
    };

    createPager(count,currentPageNo,currentPageSize);
};   

await refresh();


const searchProduct = document.getElementById("searchProduct");

function debounce(cb, delay = 250) {
    let timeout;
  
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const updateQuery = debounce(query => {
    currentQ = query;
    refresh();
  }, 1000);


searchProduct.addEventListener("input", (e) => {
    updateQuery(e.target.value);
});


const closeDialog = document.getElementById("closeDialog");
const editForm = document.getElementById("editForm");

closeDialog.addEventListener("click",async (e)=>{
    e.preventDefault();

    if(editForm.checkValidity() === false){
        
    }else{

    MicroModal.close('modal-1');

    let url = "";
    let method = "";
    let product = {
        "name" : productName.value,
        "brand" : brand.value,
        "price" : price.value,
        "rating": rating.value
        };

    if(editingProduct != null){
        product.productId = editingProduct.id;
        url =  "http://localhost:3000/api/products/" + product.productId;
        method = "PUT";
    }else{
        url =  "http://localhost:3000/api/products";
        method = "POST";
    };

    let response = await fetch(url,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: method,
          body: JSON.stringify(product)                
    });

    let json = await response.json();

    products = await fetchProducts();
    refresh();
   };
});


const btnAdd = document.getElementById("btnAdd");

btnAdd.addEventListener("click",()=>{
    productName.value = "";
    price.value = 0;
    rating.value = 0;
    editingProduct = null;

    MicroModal.show('modal-1');
    
});


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




  
