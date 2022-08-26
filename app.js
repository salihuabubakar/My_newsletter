const express = require("express");
const request = require("request");
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
    // table([firstName, lastName, email])
    // res.write(`<h1>${firstName}</h1>`);
    // res.write(`<h1>${lastName}</h1>`);
    // res.write(`<h1>${email}</h1>`);
    const data = {
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
    };

    const JsonData = JSON.stringify(data)
    const options = {
      url: "https://us11.api.mailchimp.com/3.0/lists/3b0b2ad7a6",
      method: "POST",
      headers: {
        "Authorization": `Salihu_k ${apiKey}`
      },
      body: JsonData
    };

    request(options, (error, response, body) => {
        if(error) {
          res.sendFile(__dirname + "/failure.html");
        }else {
            if(response.statusCode == 200) {
              res.sendFile(__dirname + "/success.html");
            }else {
              res.sendFile(__dirname + "/failure.html");
            }
        }
    })
})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
  log(`Server is running on ${port}`);
});

// const client = require("mailchimp-marketing");

// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });

// const run = async () => {
//   const response = await client.lists.batchListMembers("list_id", {
//     members: [{}],
//   });
//   console.log(response);
// };

// run();

