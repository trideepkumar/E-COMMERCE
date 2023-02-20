
let orderContainer = document.querySelectorAll('.userorder-container');
if (orderContainer) {
    orderContainer.forEach((orderBut)=>{

        orderBut.addEventListener('click', (e) => {
            if (e.target.classList.contains('order-cancel-btn')) {
                console.log('cancel order works');
                cancelOrder(e);
            }else  if (e.target.classList.contains('order-deliver-btn')) {
                console.log('deliver order works');
               deliverOrder(e)
            }else  if (e.target.classList.contains('order-approve-return-btn')) {
                console.log('return approval  works');
                returnOrder(e)
            } else  if (e.target.classList.contains('order-approve-refund-btn')) {
                console.log('refund approval  works');
                 refundOrder(e)
            }
        })
    })

 
}


async function cancelOrder(e) {
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `http://localhost:4000/admin/admin-order-cancel/${orderId}`;
    // console.log(url)
    alert('are you sure to cancel the order ? ')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}

async function deliverOrder(e) {
    console.log('deliver fnctn works!!');
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `http://localhost:4000/admin/admin-deliver-order/${orderId}`;
    console.log(url)
    alert('are you sure to deliver the order ?')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}


async function returnOrder(e) {
    console.log('deliver fnctn works!!');
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `http://localhost:4000/admin/admin-return-order/${orderId}`;
    console.log(url)
    alert('are you sure to take return the order ?')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}


async function refundOrder(e) {
    console.log('refund fnctn works!!');
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `http://localhost:4000/admin/admin-refund-order/${orderId}`;
    console.log(url)
    alert('are you sure to refund the payment ?')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}



//for admin product view in order

// let ProductContainer = document.querySelector('.product-view');

// if (ProductContainer) {
//     ProductContainer.addEventListener('click', (e) => {
//         if (e.target.classList.contains('product-view')) {
//             console.log('Product view works')
//             productView(e)
//         }
//     })
// }

// async function productView(e) {  
//     console.log('productView works');
//     const orderId = e.target.dataset.url
//     // console.log(orderId)
//     const url = `http://localhost:4000/admin/order-product-view/${orderId}`;
//     console.log(url)
//     alert('are you sure to open the produt view ')

//     const res = await fetch(url, {
//         method: 'get',
//         credentials: "same-origin",
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// }