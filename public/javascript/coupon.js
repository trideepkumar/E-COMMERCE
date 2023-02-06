let couponItems = document.querySelector('.dashboard');
console.log(couponItems);
if(couponItems) {
    couponItems.addEventListener('click' , (e) => {
        console.log(e.target.classList.contains('block'));
        if(e.target.classList.contains('block')) {
            couponActivate(e);
    }
    })
}

async function couponActivate(e) {
    alert('are you sure ?')
    // console.log('coupon fn working');
    const couponId = e.target.dataset.url;
    // console.log(couponId);
    const url = `http://localhost:4000/admin/updatecoupon/${couponId}`;
    const res = await fetch(url, {
                    method: 'PUT',
                    credentials: "same-origin",
                    headers: {
                    'Content-Type' : 'application/json'
                    }
                })
    const redirectPath = await res.json();
    window.location.href = redirectPath.redirect;
    
}


