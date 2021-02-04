const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require("twilio")(accountSid, authToken);

app.get("/verify", (req, res) => {
  if (!req.query.phoneNumber) {
    return res.send({ error: "You must provide a phone number" });
  }
  if (!req.query.channel) {
    return res.send({ error: "You must provide a channel" });
  }

  client.verify
    .services(serviceSid)
    .verifications.create({
      to: req.query.phoneNumber,
      channel: "sms",
    })
    .then((verification) => {
      return res.send({ verification });
    })
    .catch((error) => {
      return res.send({ error });
    });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
