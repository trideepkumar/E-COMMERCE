 
let cartCard = document.querySelector('.cart-items-container');
// console.log(cartCard)
if(cartCard) {
    cartCard.addEventListener('click' , (e) => {
        // console.log('click works!!')
        console.log(e.target)
        if(e.target.classList.contains('quantity-plus')) {
            incrementQuantity(e);
        } 
        else if(e.target.classList.contains('quantity-minus')) {
            decrementQuantity(e);
        }    
        else if(e.target.classList.contains('delete-btn')) {
            deleteCart(e);
        }
    })
}
 
// let cartdlt = document.querySelector('.delete')
// // console.log(cartdlt);
// if(cartdlt){
//     cartdlt.addEventListener('click' , (e) => {
//         console.log('click works!!')
//         console.log(e.target)
    
// })
// }
 
 //for incrementing the cart quantity
async function incrementQuantity(e) {
    const productId = e.target.dataset.url;
    console.log(productId);
    const url = `http://localhost:4000/cart/qty-plus/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });    
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}

async function decrementQuantity(e) {
    console.log('decrement fetch works!!');
    const productId = e.target.dataset.url;
    console.log(productId);
    const url = `http://localhost:4000/cart/qty-minus/${productId}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}

async function deleteCart(e){
    console.log('Dlete');
    const id = e.target.dataset.url;
    console.log(id);
    const url = `http://localhost:4000/cart/${id}` ;
    console.log(url);
    const res = await fetch(url, {
                    method: 'DELETE',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                });
                
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}