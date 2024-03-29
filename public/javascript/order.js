let codBtn = document.querySelector('.btn-cod');

if (codBtn) {
    console.log(codBtn)
    codBtn.addEventListener('click', (e) => {
        console.log('cod-click-works')
        createOrder(e);
    })
}

let razorbtn = document.querySelector('.btn-razor')
if (razorbtn) {
    console.log(razorbtn)
    razorbtn.addEventListener('click', (e) => {
        console.log('razor click works')
        createOrder(e);
    })
}

//for creating order

async function createOrder(e) {
    console.log('fun works!');
    const url = `/order/create`;
    console.log(url);
    let methodofPayment;
    if (e.target.classList.contains('btn-cod')) {
        console.log('if works!!');
        methodofPayment = 'cash on delivery'
    } else if (e.target.classList.contains('btn-razor')) {
        console.log('razor else works!!');
        methodofPayment = 'Razor pay'
    }
    const res = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totalAmount: document.querySelector('.order-price').textContent,
            paymentMethod: methodofPayment,
            orderStatus: 'placed order',
            shippingInfo: document.querySelector('input[name="address"]:checked').value
        })
    })
    const redirectPath = await res.json()
    //for razor pay setup  (getting response from the controller and opening the razorpay payment..  )
    console.log(redirectPath);
    if (redirectPath.myOrder) {
        console.log(' response redirecting works!!');
        // console.log(redirectPath.myOrder)
        var options = {
            key: "rzp_test_yoGhuX06uJTTMD", // Key ID
            amount: redirectPath.myOrder.amount * 100, 
            currency: "INR",
            order_id: redirectPath.myOrder.id, 
            handler: function(response) {
                // window.location.href = redirectPath.redirect;
                 console.log(response.razorpay_payment_id);
                orderSuccess(response.razorpay_order_id ,response.razorpay_payment_id); 
            }
        };
        console.log('options are here');
        console.log(options);
        var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

    } else {
        console.log('Y');
        window.location.href = redirectPath.redirect; 
    }
}

//for payment success
async function orderSuccess(orderId , paymentId) {
    const url = `/order/success/${orderId}`;
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    } ,
                    body: JSON.stringify({
                        paymentId : paymentId
                    })
                });

    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}







//for cancelleing order

let orderContainer = document.querySelectorAll('.user-cancel-order');
if (orderContainer) {
    orderContainer.forEach((orderBut)=>{
        orderBut.addEventListener('click', (e) => {
            if (e.target.classList.contains('order-cancel-btn')) {
                cancelOrder(e);
            }else if(e.target.classList.contains('order-return-btn')){
                console.log('order-return btn works');
                returnOrder(e);
            }
        })
    })  
}


async function cancelOrder(e) {
    const orderId = e.target.dataset.url
    // console.log(orderId)
    const url = `/order/cancel/${orderId}`;
    // console.log(url)
    alert('are you sure to cancel the order ? ')
    const res = await fetch(url, {
        method: 'PUT',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect;
}

async function  returnOrder(e){
    console.log('return order function works!!');
    const orderId = e.target.dataset.url
    console.log(orderId);
    const url = `/order/return/${orderId}`;
    console.log(url);
    alert('are you sure to return the order ? ')
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

let deleteAddress = document.querySelector('.adress-details-card-container');

if(deleteAddress){
   deleteAddress.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete-icon')){
        console.log('delete fe');
        deletingAddr(e)
    }
   })
}

async function   deletingAddr(e){
    console.log('return order function works!!');
    const deleteId = e.target.dataset.url
    const url = `/user/address-delete/${deleteId}`;
    console.log(url);
    alert('are you sure to delete the Address ? ')
    const res = await fetch(url, {
        method: 'DELETE',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const redirectPath = await res.json()
    window.location.href = redirectPath.redirect
}


