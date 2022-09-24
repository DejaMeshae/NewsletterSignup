//requiring node packages
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { STATUS_CODES } = require("http");
const { Stats } = require("fs");

//creating express = app
const app = express();

app.use(express.static("public")); //to use the static files in the public folder
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
        {
            email_address: email, 
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            } 
        }
      ]
    };

    const jsonData = JSON.stringify(data)

    const url = "https://us11.api.mailchimp.com/3.0/lists/25bcba3ca0";

    const options = {
        method: "POST",
        auth: "deja1:81e55c338ef6ca1678d46ff74bf26e70-us11"
    }

    const request = https.request(url, options, function(response) {
        //if else statement to let users know it was successful
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }     
        
        response.on("data", function(data){
            //console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    //console.log("Server Working port 3000");
    console.log("deployed on Heroku or listen to 30001")
});

//api key
//81e55c338ef6ca1678d46ff74bf26e70-us11

//list id
//25bcba3ca0