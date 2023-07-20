const express = require('express')
const mongoose = require('mongoose')
const Post = require('./model/post')
const upload = require('express-fileupload')

const app = express()//similar to=> Express app= new Express();


var dbURL = 'mongodb+srv://Aggress:L0bIcxvbgC750S5k@node-app.gsgqg9u.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Connect to mongoDB successful.');
        app.listen(4000, () => {
            console.log('listening on 4000')
        })

    })
    .catch((error) => {
        console.log('DB Connect Failed', error);

    })



//setting view engine
app.set('view engine', 'ejs')


//middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //to retrieve data from POST request
app.use(express.json())
app.use(upload())

//routes

//home page[GET]
app.get('/', (req, res) => {
    // res.end('Request for Home Page')
    let title = 'BRSS = Home'
    //retrive all posts from mongoDB

    Post.find()
        .then((result) => {
            console.log(result)
            res.render('index', { title, posts: result })
        })
        .catch((error) => {
            console.log(error)
            res.end(error.message)

        })


    //res.render('index',{ title, posts })
})


//create new post form[GET]
app.get('/posts/create', (req, res) => {

    let title = 'BRSS -Create new post'
    res.render('create-post', { title })
})


//store new post [POST]
app.post('/posts', (req, res) => {
    if (req.files) {
        let file = req.files.image
        let fileName = 'brsh_' + file.name
        let fileURL = '/uploads/' + fileName
        let fileUploadPath = './public' + fileURL

        console.log('Image file url:', fileURL)

        file.mv(fileUploadPath, (err) => {
            if (err)
                res.end(err.message)
            else {
                console.log('Image uploaded successfully')
                const post = new Post(req.body)//new instamce of Post schema
                post.image = fileURL
                post.save()
                    .then((result) => {
                        console.log('Successfully saved')
                        res.redirect('/')  //redirect to home page

                    })
                    .catch((error) => {
                        console.log('Cannotsave the post to mongoDB', error.message)
                    })



            }
        })


    }


})



//show single post [GET]
app.get('/posts/:id', (req, res) => {
    title = 'Post details'

    let postId = req.params.id

    //retrive single post from mongoDB
    Post.findById(postId)
        .then((result) => {
            res.render('post-details', { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })
})

//delete post[DELETE]
app.delete('/posts/:id', (req, res) => {
    // console.log(req.url);
    //console.log('DELETE request receive.')
    let postId = req.params.id

    Post.findByIdAndDelete(postId)
        .then((result) => {
            res.json({
                message: "Succesfully deleted post.",
                redirect: "/"
            })

        })
        .catch((error) => {
            res.end(error.message)

        })
})

//open edit form [GET]
app.get('/posts/:id/edit', (req, res) => {

    let title = 'Update post.'
    let postId = req.params.id
    Post.findById(postId)
        .then((result) => {
            res.render('update-post', { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })
})

//update post [PUT]
app.put('/posts/:id', (req, res) => {

    let postId = req.params.id
    let post = req.body

    Post.findByIdAndUpdate(postId, post)
        .then((result) => {
            res.json({
                message: 'Successfully updated..',
                redirect: '/posts/' + postId
            })

        })
        .catch((error) => {
            res.status(500).end(error.message)
        })
    //  console.log(req.body)

})
//sign up user [post]
app.post('/sign-up', (req, res) => { })

//search
app.get('/about', (req, res) => {
    let searchQuery = res.query.q
    let title ='search reasult'
    console.log(res.query.q)
    res.render('search',{title})
    Post.find({$text:{$search:searchQuery}})
    .then((reasult)=>{
        res.render('search',{title,post:reasult})
    })
})



//about page
app.get('/about', (req, res) => {
    // res.end('Request for Home Page11')
})

app.use((req, res) => {
    res.end('404 Not Found')
})