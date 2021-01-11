const querystring = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const discordBot = require('./discord.bot.js');
const cache = require('./cache.js');

const app = express();
discordBot.start();

const minecraftRegex = /^[a-zA-Z0-9_]{1,16}$/;
const discordRegex = /^.{2,32}#[0-9]{4}$/;
const ageRegex = /^[0-9]{1,2}$/;
const godfathersRegex = /^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16}){0,2}$/;
const discoveryMaxLength = 256;
const resumeMinLength = 128;
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
        res.status(401).json({
          success: false,
          message:
            'Le captcha est invalide veuillez réessayer. Si le problème persiste contactez le staff sur discord.',
        });
        return;
      }

      const minecraft = minecraftRegex.test(req.body.minecraft);
      const discord = discordRegex.test(req.body.discord);
      const age = ageRegex.test(req.body.age);
      const godfathers =
        req.body.godfathers === '' || godfathersRegex.test(req.body.godfathers);
      const discovery =
        req.body.discovery === '' ||
        req.body.discovery?.length <= discoveryMaxLength;
      const resume =
        req.body.resume !== '' &&
        req.body.resume?.length >= resumeMinLength &&
        req.body.resume?.length <= resumeMaxLength;

      const response = {
        success: true,
        inputs: {
          minecraft,
          discord,
          age,
          godfathers,
          discovery,
          resume,
        },
        inputsValidity:
          minecraft && discord && age && godfathers && discovery && resume,
        discordPresence: discord && discordBot.isUserPresent(req.body.discord),
        playerExists: false,
      };

      if (minecraft) {
        cache.playerExists(req.body.minecraft).then((playerExists) => {
          response.playerExists = playerExists;

          if (
            response.inputsValidity &&
            response.discordPresence &&
            playerExists
          ) {
            discordBot.sendUserResume(req.body);
          }

          res.json(response);
        });
      } else {
        res.json(response);
      }
    })
    .catch(() => {
      res.status(401).json({
        success: false,
        message:
          "Une erreur inconnue s'est produite lors de la validation du captcha. Si le problème persiste contactez le staff sur discord.",
      });
    });
});

module.exports = app;
