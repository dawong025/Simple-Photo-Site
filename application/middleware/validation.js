const checkUsername = (username) => {
    /**
     * Regex Explanation
     * ^ --> start of the string
     * \D --> anything NOT a digit [^0-9]
     * \w --> anything that is a alphanumeric character [a-zA-Z0-9]
     * {2,} --> 2 or more characters w/ NO UPPER LIMIT
     */
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
}

const checkPassword = (password) => {
    let passwordChecker = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/;
    return passwordChecker.test(password);
}


const checkEmail = (email) => {
    //let emailChecker = /@/;
}

const registerValidator = (req, res, next) =>{
    let username = req.body.username;
    if(!checkUsername(username)){
        req.flash("error", "invalid username!!!");
        req.session.save(err => {
            res.redirect("/register");
        })
    }
    else{
        next();
    }

}

const loginValidator = (req, res, next) =>{
    
}

module.exports = {registerValidator, loginValidator};