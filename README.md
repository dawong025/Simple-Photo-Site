[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6183263&assignment_repo_type=AssignmentRepo)
# CSC 317 Term Project

## Purpose

The purpose of this repository is to store all the code for your web application. This also includes the history of all commits made and who made them. Only code submitted on the master branch will be graded.

Please follow the instructions below and fill in the information requested when prompted.

## Student Information

|               | Information   |
|:-------------:|:-------------:|
| Student Name  | Darren Wong   |
| Student ID    | 918565679     |
| Student Email | dwong19@mail.sfsu.edu |

# Installed on Project
1. npm install
2. npm i bcrypt
3. npm i express session express-mysql-session
4. npm npm install express-validator

# Build/Run Instructions
## Build Instructions
1. cd csc317-termproject-dawong025
2. cd application

## Run Instructions
1. npm start
2. localhost:3000

Additional Notes
1. For flash messages not showing properly or login not switching to logout during login, one fix can be used
   to wrap redirect a req.session.save function call

   req.session.save(err => {
       res.redirect('/');
   }) 
2. for Refactoring for MVC - Users video, change
   return Promise.reject(-1)
   to
   return Promise.resolve(-1)
   in Users.js authenticate function