

const form = document.querySelector('.form-1');

if(form) {
    form.addEventListener('submit', (event) => {
        if (validateForm()) {
            form.submit();
        } else {
            event.preventDefault();
        }
    })
}


function validateForm() {
    console.log('Checking');

    var Firstname = document.getElementById("firstname").value;
    var Lastname = document.getElementById("lastname").value;
    var Email = document.getElementById("email").value;
    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    var Phone = document.getElementById("phone").value;
    var Password = document.getElementById("password").value;
    var password1  =document.getElementById("password1").value;
    var err = document.querySelector('.error');
    var text;
    if(Firstname==="" && Firstname.length<=2){
        text = "Please enter your first name";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    else if(Lastname==="" && Lastname.length<=2){
        text = "Please enter your last name";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    else if(Phone.length<=9){
        text = "Please enter valid phone number";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    else if (Email === "") {
        text = "Please enter a valid email";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    } else if (Email.match(mailformat) === null) {
        text = "Please enter a valid email";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    else if (Password === "") {
        text = "Please enter a valid Password";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    else if (Password.length < 5 && Password.length > 10) {
        text = "Please enter strong password ";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }else if(password1 != Password){
        text = "Please enter same password ";
        err.textContent = text;
        err.style.height = '2.5rem';
        return false;
    }
    return true;
}


//for blocking user