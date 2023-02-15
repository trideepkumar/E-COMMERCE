// //image validation


console.log('image validatiion funcrtion works');

const input = document.querySelector('input[type="file"]');
const errorMessage = document.querySelector('#errormessage');

console.log(input);

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Hello');

    
      if(document.querySelector('#fileName')) {

          let imageFile = document.querySelector('#fileName');
          if( imageFile.files.length < 4) {
              text = "Please upload product images";
              err.textContent = text ;
              err.style.height = '4rem';
              return false;
          }
  
          for (var i = 0; i < imageFile.files.length; i++) {
              var f = imageFile.files[i];
              if (!endsWith(f.name, 'jpg') && !endsWith(f.name,'png') && !endsWith(f.name,'webp') && !endsWith(f.name,'avif')) {
                  // alert(f.name + " is not a valid file!");
                  // console.log('wrong image type');
               alert('This image  file format is not suppported !! ')
                  return false;
              } 
          }
      }
      function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }


   
})
