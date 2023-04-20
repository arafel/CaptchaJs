# captchajs
[![CircleCI](https://circleci.com/gh/arafel/CaptchaJs.svg?style=svg)](https://circleci.com/gh/arafel/CaptchaJs)

CaptchaJs is a JavaScript library with the aim of making it easy to
use the [captchas.net](http://captchas.net) service.

### Installation

```
yarn add @solarwinter/captchajs
```

or

```
npm install @solarwinter/captchajs
```

### Usage

Before you can use this package you need to [register with the
captchas.net](http://captchas.net/registration/) service.

When you've registered you should receive an email from captchas.net
containing your client ID (or 'user name') and the shared secret. Load
those into your program - the common method is via .env file - and use
them to initialise CaptchaJs.

```typescript
import { CaptchaJs } from "@solarwinter/captchajs";
const captcha = new CaptchaJs({ client: process.env.CAPTCHAS_CLIENT,
                                secret: process.env.CAPTCHAS_SECRET });
const random = captcha.getRandomString();
const imageUrl = captcha.getImageUrl({ randomString: random })
const audioUrl = captcha.getAudioUrl({ randomString: random })
```

Those URLs need to be passed to the page shown to the user. The exact method of doing so will vary; if you're using ERB (similar to Jinja or Mustache) then it might look like this:

```html
<div>
    <img src="<%= captchaImageUrl %>" alt="Captcha image">
    <a href="<%= captchaAudioUrl %>" alt="Audio version of captcha">Captcha audio</a>
    <label for="captchaPassword">
        Captcha text?
    </label>
    <input type="hidden" name="randomString" value="<%= randomString %>" />
    <input name="captchaPassword" type="text" required />
</div>
```

When the user hits Submit on the form, the fields should be POSTed back to your server application. There you can check the captcha string - for example:

```typescript
if (!captcha.validateRandomString(data.randomString)) {
    console.log(`Error validating random string ${data.randomString}`);

    // At this point you can re-render the contact page, for example with error text:
    //   "That captcha has expired or already been used"
} else if (!captcha.verifyPassword(data.randomString, data.captchaPassword)) {
    console.log(`Error verifying password ${data.captchaPassword}`);

    // At this point you can re-render the contact page, for example with error text:
    //   "Sorry, you got the captcha text wrong. Please try again."
} else {
    console.log("Captcha passed!");
    // Do something here!
}
```
