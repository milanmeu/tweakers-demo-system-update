// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const webPush = require('web-push');
const express = require("express");
const app = express();


if (!process.env.PublicKey || !process.env.PrivateKey) {
  console.log("You must set the PublicKey and PrivateKey "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
}


webPush.setVapidDetails(
  'https://glitch.com/',
  process.env.PublicKey,
  process.env.PrivateKey
);




const bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({ extended: true }));


// create application/json parser
var jsonParser = bodyParser.json()
 

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});




app.get('/vapidPublicKey', function(req, res) {
  res.send(process.env.PublicKey);
});


app.post('/register', jsonParser, function(req, res) {
      console.log(req.body)
      res.sendStatus(201);
});

app.post('/sendNotification', jsonParser, function(req, res) {
  console.log("SendNotification")
  console.log(req.body)
  const subscription = req.body.subscription;
  const payload = null
  const options = {
    TTL: req.body.ttl
  };

  setTimeout(function() {
    console.log("webpush send")
    webPush.sendNotification(subscription, payload, options)
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
  }, req.body.delay * 1000);
});
