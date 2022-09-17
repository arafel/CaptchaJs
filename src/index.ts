import { createHash } from 'node:crypto';

import randomstring from "randomstring";

const standardAlphabet = "abcdefghijklmnopqrstuvwxyz";

export interface CaptchaJsOptions {
  client: string,
  secret: string,
  numberOfLetters?: number;
  width?: number;
  height?: number;
  alphabet?: string;
}

const defaultOptions: CaptchaJsOptions = {
  // These are defined in default but not expected ever to be used.
  client: "demo",
  secret: "secret",
  numberOfLetters: 6,
  width: 240,
  height: 80,
  alphabet: standardAlphabet
};

export class CaptchaJs implements CaptchaJs {
  private opts: CaptchaJsOptions;

  constructor(options: CaptchaJsOptions) {
    if (!options.client) {
      throw new Error("No client ID provided");
    }
    if (!options.secret) {
      throw new Error("No secret provided");
    }
    if (options.alphabet === "") {
      throw new Error("Can't use an empty alphabet");
    }
    if (options.numberOfLetters == 0) {
      throw new Error("Need at least one letter");
    }

    this.opts = Object.assign({}, defaultOptions, options);
  }

  getRandom(): string {
    const hash = createHash('md5');
    const random = randomstring.generate({
                                           length: 12,
                                           charset: 'alphabetic',
                                           capitalization: "lowercase"
                                         });
    const concatString = this.opts.secret + random;
    hash.write(concatString);
    const digest = hash.digest().slice(0, this.opts.numberOfLetters);
    const ss = digest.slice(0, this.opts.numberOfLetters);
    // TODO rewrite with map() or similar
    let password = "";
    for (const c of ss) {
      // 'alphabet' will exist, we'll have used the default if needed.
      password += this.opts.alphabet![c % this.opts.alphabet!.length]
    }

    return password;
  }

  getImageUrl(randomString?: string, base = "http://image.captchas.net/"): string {
    if (!randomString) {
      randomString = this.getRandom();
    }
    let url = `${base}?client=${this.opts.client}&random=${randomString}`
    if (this.opts.alphabet !== standardAlphabet) {
      url += `&alphabet=${this.opts.alphabet}`;
    }
    if (this.opts.numberOfLetters !== 6) {
      url += `&letters=${this.opts.numberOfLetters}`;
    }
    if (this.opts.width !== 240) {
      url += `&width=${this.opts.width}`;
    }
    if (this.opts.height !== 80) {
      url += `&height=${this.opts.height}`;
    }
    return url;
  }

  getAudioUrl(randomString?: string, base = "http://audio.captchas.net/"): string {
    if (!randomString) {
      randomString = this.getRandom();
    }
    let url = `${base}?client=${this.opts.client}&random=${randomString}`;
    if (this.opts.alphabet !== standardAlphabet) {
      url += `&alphabet=${this.opts.alphabet}`;
    }
    if (this.opts.numberOfLetters !== 6) {
      url += `&letters=${this.opts.numberOfLetters}`;
    }
    return url;
  }
}
