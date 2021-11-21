const form = document.getElementById("form");
const username = document.getElementById("username");
const password =  document.getElementById("password");
const conf_password = document.getElementById("conf-password");
const email = document.getElementById("email");
const age = document.getElementById("age");
const TOS = document.getElementById("TOS");

form.addEventListener("submit",(e)=>{
    //prevents default submit, checks inputs first
    //e.preventDefault();
    validateInputs();
});

function validateInputs(){
    const usernameVal = username.value.trim();
    const passwordVal = password.value.trim();
    const conf_passwordVal = conf_password.value.trim();
    
    //begins with a letter, followed by 2 or more letters/numbers
    const regexPatternU = /^[a-zA-Z][a-zA-Z0-9]{2,}/;
    var regexTestU = regexPatternU.test(usernameVal);
    var testUName = false;

    //Is 8 or more characters long, including 1 or more of the following:
    //uppercase letter, lowercase letter, digit, and symbol (/*-+!@#$^&*)
    const regexPatternP =/^(?=.{8,})(?=.*[A-Z])(?=.*[0-9])(?=.*[/*-+!@#$^&*]).*$/;
    var regexTestP = regexPatternP.test(passwordVal);
    var testPass = false;
    var testCPass = false;

    const emailVal = email.value.trim();
    var testEmail = false;

    var testAge = false;
    var testTOS = false;

    //Username checks
    if(usernameVal === ""){
        window.alert("Username cannot be blank");
    }
    else if(regexTestU==false){
        window.alert("Username must begin with a letter, followed by 2 or more letters/numbers");
    }
    else{
        testUName = true;
    }

    //Password checks
    if(passwordVal === ""){
        window.alert("Password cannot be blank");
    }
    else if(regexTestP==false){
        window.alert("Password must be at least 8 characters, with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (/*-+!@#$^&*)")
    }
    else{
        testPass = true;
    }
    
    //Confirmation password checks
    if(conf_passwordVal === ""){
        window.alert("Please confirm your password");
    }
    else if(passwordVal != conf_passwordVal){
        window.alert("Password confirmation must match the password from above.");
    }
    else{
        testCPass = true;
    }

    //other -non-username + non-password related checks
    if(!(emailVal === "")){
        testEmail = true;
    }
    if(age.checked==true){
        testAge = true;
    }
    if(TOS.checked==true){
        testTOS= true;
    }

    //if all fields are filled and sufficiently passing, reload the page
    if((testUName && testPass)&& (testCPass && testEmail) &&(testAge && testTOS)){
        //location.submit();
    }
    



}

