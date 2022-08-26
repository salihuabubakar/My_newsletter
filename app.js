const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const bodyParser = require("body-parser");
const port = 3000;
const {log, error, table} = console;

const apiKey = "2e0b268855fbb5ca139fc30fedd6de41-us11";
const audienceId = "3b0b2ad7a6";

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    const {firstName, lastName, email} = req.body;

    client.setConfig({
      apiKey: apiKey,
      server: "us11",
    });

    const run = async () => {
      const response = await client.lists.batchListMembers(audienceId, {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      });
        if (response) {
          res.sendFile(__dirname + "/success.html");
        }
    };

    run().catch(function(error) {
        if(error) {
          res.sendFile(__dirname + "/failure.html");
        }
    })
    
})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
  log(`Server is running on ${port}`);
});



