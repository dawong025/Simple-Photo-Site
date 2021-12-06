var PostModel = require("../models/Posts");
const postMiddleware = {};

postMiddleware.getRecentPosts = async function(req, res, next){
    try {
        let results = await PostModel.getNRecentPosts(12);
        res.locals.results = results;
        if(results.length == 0){
            req.flash("error", "There are no post created yet");
        }
        next();
    }catch(err){
        next(err)
    }
    /*
    let baseSQL = `SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 8`;
    db.execute(baseSQL, [])
    .then(([results, fields]) =>{
        res.locals.results = results;
        if(results && results.length == 0){
            req.flash("error","There are no posts created yet");
        }
        next();
    })
    .catch((err) => next(err));
    */
}

module.exports = postMiddleware;