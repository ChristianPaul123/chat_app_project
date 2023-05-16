const container = document.querySelector(".container");
const    pwShowHide = document.querySelectorAll(".showHidePw");
const    pwFields = document.querySelectorAll(".password");
const    signUp = document.querySelector(".signup-link");
const    login = document.querySelector(".login-link");

  //   js code to show/hide password and change icon
  pwShowHide.forEach(eyeIcon =>{
      eyeIcon.addEventListener("click", ()=>{
          pwFields.forEach(pwField =>{
              if(pwField.type ==="password"){
                  pwField.type = "text";

                  pwShowHide.forEach(icon =>{
                      icon.classList.replace("uil-eye-slash", "uil-eye");
                  })
              }else{
                  pwField.type = "password";

                  pwShowHide.forEach(icon =>{
                      icon.classList.replace("uil-eye", "uil-eye-slash");
                  })
              }
          }) 
      })
  })

  // js code to appear signup and login form
  signUp.addEventListener("click", ( )=>{
      container.classList.add("active");
  });
  login.addEventListener("click", ( )=>{
      container.classList.remove("active");
  });


function loginAccount(e) {
      let email = document.forms['loginForm']['email'].value;
      let password = document.forms['loginForm']['password'].value;

      var user = localStorage.getItem(email);
      var data = JSON.parse(user);

      if (user == null || password != data.password) {
        alert('Incorrect email or password');
        return false;
      } else if (email == data.email && password == data.password) {
        alert(`Welcome back ${data.firstName}!`);
        localStorage.setItem('signedInUser', user);
        return true;
      }
    };

function createAccount(e) {
  var Name = document.forms['signupForm']['user-name'].value;
  var email = document.forms['signupForm']['email'].value;
  var password = document.forms['signupForm']['password'].value;
  var confirmPassword = document.forms['signupForm']['confirmed-pass'].value;

  var data = localStorage.getItem(email);
  var name = localStorage.getItem(Name);

  if(name != null){
    window.alert('Username has already be taken!');
    return false;
  }
  else if (data != null) {
    window.alert('Email already registered.');
    return false;
  }
  else if (password != confirmPassword) {
    window.alert('Password entered does not match. Please re-enter.');
    return false;
  }
  else {
    var newUser = {
      Name:Name,
      email: email,
      password: password,
      
    };

    window.alert('Account successfully created.\nYou can now login your new account.');
    var json = JSON.stringify(newUser);
    var json2 = JSON.stringify(newUser);
    localStorage.setItem(email, json);
    localStorage.setItem(Name,json2);
    console.log("user added");
    return true;
  }
};


