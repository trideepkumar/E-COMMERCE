let codBtn = document.querySelector('.btn-cod');

if (codBtn) {
    console.log(codBtn)
    codBtn.addEventListener('click', () => {
        console.log('clickworks');
        createOrder();
    })
}

//for creating order

async function createOrder() {
    console.log('fun works!');
    const url = `http://localhost:4000/order/create`;
    console.log(url);
    const res = await fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            totalAmount: document.querySelector('.order-price').textContent,
            paymentMethod: 'Cash on delivery',
            orderStatus:'placed order',
            shippingInfo: document.querySelector('input[name="address"]:checked').value
        })
    })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
}