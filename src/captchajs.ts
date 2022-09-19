import { createHash } from 'node:crypto';

import randomstring from "randomstring";
import { MemoryRandomStore } from "./memory_randomstore";
import { CaptchaJsOptions, GetAudioUrlOptions, GetImageUrlOptions, RandomStore } from "./index";

const standardAlphabet = "abcdefghijklmnopqrstuvwxyz";

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
  private randomStore: RandomStore;

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
    if (options.numberOfLetters === 0) {
      throw new Error("Need at least one letter");
    }

    this.opts = Object.assign({}, defaultOptions, options);
    this.randomStore = options.randomStore ?? new MemoryRandomStore();
  }

  getRandomString(): string {
    let rs;
    // console.log("getRandomString in");
    do {
      rs = randomstring.generate({ length: 40 });
      // console.log("Trying random string", rs);
    } while (!this.randomStore.addRandom(rs));

    // console.log("Returning", rs)
    return rs;
  }

  makePassword(random: string): string {
    if (!random) {
      throw new Error("No random string supplied");
    }
    const concatString = this.opts.secret + random;
    const hash = createHash('md5');
    hash.write(concatString);
    const substring = hash.digest().slice(0, this.opts.numberOfLetters);
    // TODO rewrite with map() or similar
    let password = "";
    for (const c of substring) {
      // 'alphabet' will exist by now, we'll have used the default if needed.
      password += this.opts.alphabet![c % this.opts.alphabet!.length]
    }

    return password;
  }

  getImageUrl(opts: GetImageUrlOptions): string {
    const base = opts?.baseURL || "https://image.captchas.net/";
    const password = this.makePassword(opts.randomString);
    let url = `${base}?client=${this.opts.client}&random=${password}`
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

  getAudioUrl(opts: GetAudioUrlOptions): string {
    const base = opts?.baseURL || "https://audio.captchas.net/";
    const password = this.makePassword(opts.randomString);
    let url = `${base}?client=${this.opts.client}&random=${password}`;
    if (this.opts.alphabet !== standardAlphabet) {
      url += `&alphabet=${this.opts.alphabet}`;
    }
    if (this.opts.numberOfLetters !== 6) {
      url += `&letters=${this.opts.numberOfLetters}`;
    }
    return url;
  }

  validateRandomString(randomString: string, invalidate=true): boolean {
    return this.randomStore.validateRandom(randomString, invalidate);
  }

  verifyPassword(randomString: string, password: string): boolean {
    if (password.length != this.opts.numberOfLetters) {
      return false;
    }

    const ourPassword = this.makePassword(randomString);
    return ourPassword === password;
  }
}
