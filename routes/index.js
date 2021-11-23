const express = require('express')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book')
const multer = require('multer')

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
});

var upload = multer({
    storage: storage,
}).single('image');


// Welcome = Homepage
router.get('/', (req, res) => {
   res.render('welcome') 
})

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Book.find().exec((err, books) => {
        
        if(err){
            res.json({
                message: err.message,
            })
        } else{
            console.log(books)
            res.render('dashboard', { 
                title: "Home Page",
                books: books,
            })
        }
    })
})


router.post('/dashboard', ensureAuthenticated, upload, (req, res) => {
    // console.log(req.body)
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        image: req.file.filename,
    });
    newBook.save((error) => {
        if(error) {
            res.json({message: err.message, type: "danger"})
        } else {
            req.session.message = {
                type: "success",
                message: "Book added successfully"
            };
            res.redirect('/dashboard');
        }
    })
})

module.exports = router;