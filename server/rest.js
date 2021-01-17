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

const paypalEndpoint =
  process.env.PAYPAL_MODE === 'SANDBOX'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

app.disable('x-powered-by');
app.use(bodyParser.json());

app.post('/candidater', (req, res) => {
  axios
    .post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: process.env.RECAPTCHA_SECRET,
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

const getPaypalAccessToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${paypalEndpoint}/v1/oauth2/token`,
        querystring.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'fr_FR',
            'Content-Type': 'application/json',
          },
          auth: {
            username: process.env.PAYPAL_KEY,
            password: process.env.PAYPAL_SECRET,
          },
        }
      )
      .then((res) => resolve(res.data.access_token))
      .catch((err) => reject(err.response.data));
  });
};

app.post('/create-order', (req, res) => {
  if (
    typeof req.body.username === 'undefined' ||
    typeof req.body.amount === 'undefined'
  ) {
    return res.sendStatus(500);
  }
  const username = req.body.username === '' ? 'Anonyme ' : req.body.username;
  const amount = parseFloat(req.body.amount).toFixed(2);

  if (minecraftRegex.test(username)) {
    getPaypalAccessToken()
      .then((accessToken) => {
        axios
          .post(
            `${paypalEndpoint}/v2/checkout/orders`,
            {
              intent: 'CAPTURE',
              application_context: {
                brand_name: 'La Palmeraie',
                locale: 'fr-FR',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'CONTINUE',
              },
              purchase_units: [
                {
                  amount: {
                    currency_code: 'EUR',
                    value: amount,
                    breakdown: {
                      item_total: {
                        currency_code: 'EUR',
                        value: amount,
                      },
                    },
                  },
                  items: [
                    {
                      name: 'Donation',
                      description: username,
                      unit_amount: {
                        currency_code: 'EUR',
                        value: amount,
                      },
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                    },
                  ],
                },
              ],
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((response) => res.json({ id: response.data.id }))
          .catch(() => res.sendStatus(500));
      })
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(500);
  }
});

app.post('/capture-order/:id', (req, res) => {
  getPaypalAccessToken()
    .then((accessToken) => {
      axios
        .post(
          `${paypalEndpoint}/v2/checkout/orders/${req.params.id}/capture`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(() => {
          res.json({ status: 'success' });
        })
        .catch(() => res.sendStatus(500));
    })
    .catch(() => res.sendStatus(500));
});

module.exports = app;
