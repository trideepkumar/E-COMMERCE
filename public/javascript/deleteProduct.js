let datatable= document.getElementById("datatable")
if(datatable){
    console.log("working100")
 datatable.addEventListener('click', (e)=>{
    console.log(e.target.classList.contains('delete-prod'))
    if(e.target.classList.contains('delete-prod')){
        alert('are you sure you want to delete?')
        deleteprod(e)
        console.log("working3")
    }else if(e.target.classList.contains('action-prod')){
        alert('are you sure  to block?')
        console.log("working3")
        blockProduct(e)
    }
 })   
}

async function deleteprod(e){
    console.log(e)
    console.log("working2")
    const data=e.target.dataset.url
    console.log(data)
    const url = 'http://localhost:4000/admin/products/delete/'+data
    console.log(url)
    const id=`${data}`

    fetch(url,{
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => response.json())
    .then(response=>{
        console.log("working")
        window.location.href=response.redirect
    })
    
}


async function blockProduct(e){
    console.log(e)
    console.log("soft delete works")
    const data=e.target.dataset.url
    console.log(data)
    const url = 'http://localhost:4000/admin/products/block-product/'+data
    console.log(url)
    const id=`${data}`
    console.log(id);
    fetch(url,{
        method:'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id:id})
    })
    .then(response => response.json())
    .then(response=>{
        console.log("working")
        window.location.href=response.redirect
    })
    
}