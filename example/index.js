'use strict';

const express = require("express");
const Mustache = require('mustache');

const { CaptchaJs } = require("../build");
// const { CaptchaJs } = require("@solarwinter/CaptchaJs");

const captcha = new CaptchaJs({
  client: "demo",
  secret: "secret"
});

// Three {} means that Mustache will leave the HTML tags alone.
const page = "<html><head></head><body>{{{content}}}</body></html>";
const app = express();

app.use(require("body-parser").urlencoded({ extended: true }));
app.get("/", sendForm);
app.post("/", processForm);
app.listen(8000);

function sendForm(req, res) {
  const random = captcha.getRandomString();
  const imageUrl = captcha.getImageUrl({ randomString: random })
  const audioUrl = captcha.getAudioUrl({ randomString: random })

  const content = `<form method="POST">
          <img src="${imageUrl}" alt="Captcha image">
          <a href="${audioUrl}" alt="Audio version of captcha">Captcha audio</a>
          <label for="captchaText">
              Captcha text?
          </label>
          <input type="hidden" name="randomString" value="${random}" />
          <input name="captchaText" type="text" required />
          <button type="submit">Click me</button>
      </form>`;
  res.send(Mustache.render(page, { content: content }));
};

function processForm(req, res) {
  let content;
  const randomString = req.body.randomString;
  const captchaText = req.body.captchaText;

  if (!captcha.validateRandomString(randomString)) {
    content = '<p>That captcha has expired or already been used. <a href="/">Please try again.</a></p>';
  } else if (!captcha.verifyPassword(randomString, captchaText)) {
    content = '<p>Sorry, you got the captcha text wrong. <a href="/">Please try again.</a></p>';
  } else {
    content = '<p>Well done, you got it right! <a href="/">Play again?</a></p>';
  }

  res.send(Mustache.render(page, { content: content }));
}
