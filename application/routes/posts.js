var express = require("express");
var router = express.Router();
var db = require("../conf/database");
const {
    errorPrint,
    successPrint
} = require("../helpers/debug/debugprinters");
var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");
var PostModel = require("../models/Posts");
var PostError = require("../helpers/error/PostError");
const { response } = require("express");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/upload");
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split("/")[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({ storage: storage });

router.post("/createPost", uploader.single("uploadImage"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    /*
        do server side validation
        see if title, desc, and fk are not empty
    */

    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(
                title,
                description,
                fileUploaded,
                destinationOfThumbnail,
                fk_userId,
            );
            /*
            let baseSQL = `INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUE (?,?,?,?,now(),?);`
            return db.execute(baseSQL,[title, description, fileUploaded, destinationOfThumbnail, fk_userId]);
            */
        })
        .then((postWasCreated) => {
            //.then(([results, fields]) => {
            if (postWasCreated) {
                //if(results && results.affectedRows){
                req.flash("success", "Your post was created successfully!");

                req.session.save(err => {
                    res.redirect("/")
                })

                //resp.json({status: "OK", message: "Post was created", "redirect":"/"});
            }
            else {
                throw new PostError("Post could not be created!!", "postImage", 200);
                //resp.json({status: "OK", message: "Post was not created", "redirect":"/postimage"});
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                req.flash("error", err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }
            else {
                next(err);
            }
        })
});

//localhost:3000/posts/search?search=value
router.get("/search", async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                message: "No search term given",
                results: []
            });
        }
        else {
            /*
            let baseSQL = "SELECT id, title, description, thumbnail, concat_ws('', title, description) \
        AS haystack \
        FROM posts \
        HAVING haystack LIKE ?;"
            let sqlReadySearchTerm = "%" + searchTerm + "%";
            let [results, fields] = await db.execute(baseSQL, [sqlReadySearchTerm]);
            */
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: ` ${results.length} results found`,
                    results: results
                });
            }
            else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "No results were found for your search \
                        but here are the 8 most recent posts",
                    results: results
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});
module.exports = router;