
let logoutContainer = document.querySelector('.log');
if (logoutContainer) {
    logoutContainer.addEventListener('click', (e) => {
        console.log('click works!1');
        console.log(e.target);
        if (e.target.classList.contains('logout')) {
            console.log('logout works');
            alert('are you sure to logout!!')
            return true;
        }
    })
}

