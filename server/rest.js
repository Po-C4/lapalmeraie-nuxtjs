const querystring = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

const minecraftRegex = /^[a-zA-Z0-9_]{1,16}$/;
const discordRegex = /^.{2,32}#[0-9]{4}$/;
const ageRegex = /^[0-9]{1,2}$/;
const godfathersRegex = /^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16}){0,2}$/;
const discoveryMaxLength = 256;
const resumeMaxLength = 2048;

app.disable('x-powered-by');
app.use(bodyParser.json());

app.post('/candidater', (req, res) => {
  axios
    .post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: process.env.SECRET_SITE_KEY,
        response: req.body.token,
      })
    )
    .then(({ data: { success } }) => {
      if (!success) {
        res
          .status(401)
          .json({ success: false, message: 'The captcha token is invalid' });
        return;
      }

      const minecraftValidity = minecraftRegex.test(req.body.minecraft);
      const discordValidity = discordRegex.test(req.body.discord);
      const ageValidity = ageRegex.test(req.body.age);
      const godfathersValidity =
        req.body.godfathers === '' || godfathersRegex.test(req.body.godfathers);
      const discoveryValidity =
        req.body.discovery === '' ||
        req.body.discovery.length <= discoveryMaxLength;
      const resumeValidity =
        req.body.resume !== '' && req.body.resume.length <= resumeMaxLength;

      const response = {
        success: true,
        inputs: {
          minecraft: minecraftValidity,
          discord: discordValidity,
          age: ageValidity,
          godfathers: godfathersValidity,
          discovery: discoveryValidity,
          resume: resumeValidity,
        },
        inputsValidity:
          minecraftValidity &&
          discordValidity &&
          ageValidity &&
          godfathersValidity &&
          discoveryValidity &&
          resumeValidity,
      };

      res.json(response);
    })
    .catch(() => {
      res.status(401).json({
        success: false,
        message: 'An unknown error occured while validating the captcha token',
      });
    });
});

module.exports = app;
