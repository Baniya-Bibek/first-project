var http=require('http')
http.createServer((request,response)=>
{
    console.log("Listening on port 5500..");
    response.write("hello")
    response.end()

}).listen(5500)

 
