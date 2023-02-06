
let orderContainer = document.querySelector('.userorder-container');
if (orderContainer) {
    orderContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('order-cancel-btn')) {
            console.log('cancel order works');
            cancelOrder(e);
        }
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