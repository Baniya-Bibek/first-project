var http = require('http')

var fs = require('fs');
const { url } = require('inspector');

/*http.createServer((request,response)=>{
    console.log ("Listening on port 4000....")
   response.write('Welcome to backend develop ment')
   response.end()
}).listen(4000)*/

//console.log(http)
var Server = http.createServer((req, res) => {
    console.log('request made....')
    console.log(req.method, req.url)
    res.setHeader('Content-Type', 'text/html')

     var path='./views/'
                
    switch (req.url) {
        case "/":
            path = path+"index.html"
            res.statusCode=200
            break;
 
        case "/about":
              
            path = path+"about.html"
            res.statusCode=200
            break;

       

        default :
            path=path+"404.html"
            res.statusCode=404
            break;

    }

    fs.readFile(path, (error, data)=>{
        if(error){
            console.log(error.message)
            res.end(error.message)
        }
        res.end(data)
    }) 


})

Server.listen(4000, 'localhost', () => {
    console.log('listening on port 4000...')
})