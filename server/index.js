//mongoose file must be loaded before all other files in order to provide
// models to other modules
require('dotenv').config();
(passport = require('passport')),
  (express = require('express')),
  (jwt = require('jsonwebtoken')),
  (expressJwt = require('express-jwt')),
  (router = express.Router()),
  (cors = require('cors')),
  (bodyParser = require('body-parser')),
  (request = require('request')),
  (twitterConfig = require('./twitter.config.js'));

var passportConfig = require('./passport');

//setup configuration for twitter login
passportConfig();

var app = express();

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//rest API requirements
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

router.route('/health-check').get(function (req, res) {
  res.status(200);
  res.send('Hello World');
});

var createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id
    },
    'my-secret',
    {
      expiresIn: '2d'
    }
  );
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.token));
};

const otp = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};

router.route('/auth/twitter/reverse').post(function (req, res) {
  request.post(
    {
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http%3A%2F%2Flocalhost%3A5173%2Fverify',
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret
      }
    },
    function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      var jsonStr =
        '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.json({ str: JSON.parse(jsonStr), otp });
    }
  );
});

router.route('/auth/twitter').post(
  (req, res, next) => {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token`,
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      },
      function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      }
    );
  },
  passport.authenticate('twitter-token', { session: false }),
  function (req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id
    };

    return next();
  },
  generateToken,
  sendToken
);

app.use('/api/v1', router);

app.listen(8000);
module.exports = app;

console.log('Server running at http://localhost:8000/');
