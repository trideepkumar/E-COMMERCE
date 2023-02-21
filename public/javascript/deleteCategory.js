
let datatable = document.getElementById("datatable")
if(datatable){
    console.log("table found by id?")
 datatable.addEventListener('click', (e)=>{
    // console.log("button click works")
    // console.log(e.target.classList.contains('delete-cat'))
    if(e.target.classList.contains('delete-cat')){
        alert('are you sure ?')
        deleteCat(e)
        console.log("working!!")
    }
 })   
}

async function deleteCat(e){
    const userId = e.target.dataset.url;
    // console.log(`${userId}`)
    // console.log(userId)
    const id = `${userId}`
    const url = `/admin/category/${userId}` ;
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