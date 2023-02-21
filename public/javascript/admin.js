

let datatable = document.getElementById('datatable');
if (datatable) {
    datatable.addEventListener('click', (e) => {
        if (e.target.classList.contains('block')) {
            alert('are you sure ?')
            blockUser(e)
        }
        })
        }
        // else if (e.target.classList.contains('unblock')) {
        //   alert('are you sure to unblock ?')
        //   blockUser(e)
        // }

async function blockUser(e){
    const userId = e.target.dataset.url;
    console.log(`${userId}`)
    console.log(userId)
    const id = `${userId}`
    const url = `/admin/admin-user/block/${userId}` ;
    console.log(url)


    const res = await fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type' : 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => response.json())
    .then(response =>{
        window.location.href=response.redirect;
    })

}



