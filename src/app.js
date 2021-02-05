const express = require("express");
const { reservationsUrl } = require("twilio/lib/jwt/taskrouter/util");

const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require("twilio")(accountSid, authToken);

app.get("", (req, res) => res.send("<p>twilio-api</p>"));

app.get("/send-code", (req, res) => {
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
      return res.send({ status: verification.status });
    })
    .catch((error) => {
      return res.send({ error });
    });
});

app.get("/check-code", (req, res) => {
  if (!req.body.phoneNumber) {
    return res.send({ error: "You must provide a phone number" });
  }
  if (!req.body.code) {
    return res.send({ error: "You must provide a code" });
  }
  client.verify
    .services(serviceSid)
    .verificationChecks.create({
      to: req.body.phoneNumber,
      code: req.body.code,
    })
    .then((verification_check) =>
      res.send({ status: verification_check.status })
    )
    .catch((error) => {
      return res.send({ error });
    });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
