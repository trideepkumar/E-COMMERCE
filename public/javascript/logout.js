
console.log('hahahah');
 
let logoutContainer = document.querySelector('.dropdown-menu');
if (logoutContainer) {
    logoutContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('logout')) {          
            console.log('logout works');
           alert('are you sure to logout!!')
        }
    })
}

