

// function updateProduct() {
//   // console.log("update working started")
//   const name = document.querySelector('#productname').value
//   const price = document.querySelector('#price').value
//   const description = document.querySelector('#description').value
//   const category = document.querySelector('#inputCat').value
//   const image = document.querySelector('#fileName').value
//   // console.log(image);
//   // console.log(name,price,description,category);

//   const data = document.querySelector('#update-button').dataset.url
//   const url = '/admin/edit-product/' + data
//   // console.log(data)
//   // console.log(url)
//   const error = document.querySelector('#error')
//   const id = data
//   // console.log(id)

//   body = {

//     name,
//     price,
//     description,
//     category,
//     image
//   }

//   fetch(url, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(body, { _id: id })
//   })
//     .then(response => response.json())
//     // .then(response => {
//     //   if (response.successStatus) {
//     //     window.location.href = response.redirect
//     //   } else {
//     //     error.innerHTML = response.message
//     //   }
//     // })
// }