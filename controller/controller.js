var express = require("express");
var router = express.Router();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.redirect("/articles");
});

router.get("/scrape", function(req, res) {

  request("https://www.esquire.com/food-drink/", (error, response, html)=> {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $(".full-item").each((i, el) => {
      var result = {};

      result.title = $(el)
        .find(".full-item-title")
        .text()
        .replace(/\s\s+/g, '');

      result.link = $(el)
      .find(".full-item-title")
      .attr('href');

      result.image = $(el)
      .find("img")
      .attr('data-src');



      console.log(result);


      if (result.title !== "" && result.link !== "" && result.image !== "") {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Article.count({ title: result.title }, function(err, test) {
            if (test === 0) {
              var entry = new Article(result);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log("Article already exists.");
        }
      } else {
        console.log("Not saved to DB, missing data");
      }
    });
    res.redirect("/");
  });
});



router.get("/articles", function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});

router.get("/articles-json", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get("/clearAll", function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all articles");
    }
  });
  res.redirect("/articles-json");
});

// router.get("/readArticle/:id", function(req, res) {
//   var articleId = req.params.id;
//   var hbsObj = {
//     article: [],
//     body: []
//   };

//   Article.findOne({ _id: articleId })
//     .populate("comment")
//     .exec(function(err, doc) {
//       if (err) {
//         console.log("Error: " + err);
//       } else {
//         hbsObj.article = doc;
//         var link = doc.link;
//         request(link, function(error, response, html) {
//           var $ = cheerio.load(html);

//           $(".l-col__main").each(function(i, element) {
//             hbsObj.body = $(this)
//               .children(".full-item")
//               .children(".full-item-title")
//               .text();

//             res.render("article", hbsObj);
//             return false;
//           });
//         });
//       }
//     });
// });


// router.post("/comment/:id", function(req, res) {
//   var user = req.body.name;
//   var content = req.body.comment;
//   var articleId = req.params.id;

//   var commentObj = {
//     name: user,
//     body: content
//   };

//   var newComment = new Comment(commentObj);

//   newComment.save(function(err, doc) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(doc._id);
//       console.log(articleId);

//       Article.findOneAndUpdate(
//         { _id: req.params.id },
//         { $push: { comment: doc._id } },
//         { new: true }
//       ).exec(function(err, doc) {
//         if (err) {
//           console.log(err);
//         } else {
//           res.redirect("/readArticle/" + articleId);
//         }
//       });
//     }
//   });
// });
module.exports = router;