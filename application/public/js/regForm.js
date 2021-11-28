const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const conf_password = document.getElementById("conf-password");
const email = document.getElementById("email");
const age = document.getElementById("age");
const TOS = document.getElementById("TOS");

form.addEventListener("submit", (e) => {
    //prevents default submit, checks inputs first
    if (!validateUser()) {
        e.preventDefault();
    }
    if (!validatePassword()) {
        e.preventDefault();
    }
    if (!validateCPassword()) {
        e.preventDefault();
    }
});

function validateUser() {
    //Username checks
    //begins with a letter, followed by 2 or more letters/numbers
    const regexPatternU = /^\D\w{2,}$/;
    const usernameVal = username.value.trim();
    var regexTestU = regexPatternU.test(usernameVal);
    var testUName = false;

    if (regexTestU == false) {
        window.alert("Username must begin with a letter, followed by 2 or more letters/numbers");
        testUName = false;
    }
    else {
        testUName = true;
    }
    return testUName;
}
function validatePassword() {
    //Is 8 or more characters long, including 1 or more of the following:
    //uppercase letter, lowercase letter, digit, and symbol (/*-+!@#$^&*)
    const regexPatternP = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
    const passwordVal = password.value.trim();
    var regexTestP = regexPatternP.test(passwordVal);
    var testPass = false;
    //Password checks
    if (regexTestP == false) {
        window.alert("Password must be at least 8 characters, with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (/*-+!@#$^&*)");
        testPass = false;
    }
    else {
        testPass = true;
    }
    return testPass;
}

function validateCPassword() {
    const conf_passwordVal = conf_password.value.trim();
    var testCPass = false;
    //Confirmation password checks
    if (passwordVal != conf_passwordVal) {
        window.alert("Password confirmation must match the password from above.");
        testCPass = false;
    }
    else {
        testCPass = true;
    }
    return testCPass;
}