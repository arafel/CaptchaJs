import { createHash } from 'node:crypto';
import randomstring from "randomstring";

import { CaptchaJsOptions } from "./index";

const standardAlphabet = "abcdefghijklmnopqrstuvwxyz";

const defaultOptions: CaptchaJsOptions = {
    numberOfLetters: 6,
    width: 240,
    height: 80,
    alphabet: "abcdefghijklmnopqrstuvwxyz"
};

export class CaptchaJs implements CaptchaJs {
    private client: string;
    private secret: string;
    private opts: CaptchaJsOptions;

    constructor(client: string, secret: string, options: CaptchaJsOptions | undefined) {
        if (!client) {
            throw new Error("No client ID provided");
        }
        if (!secret) {
            throw new Error("No secret provided");
        }

        this.client = client;
        this.secret = secret;
        this.opts = Object.assign({}, defaultOptions, options);
    }

    getRandom(): string {
        const hash = createHash('md5');
        const random = randomstring.generate({
            length: 12,
            charset: 'alphabetic',
            capitalization: "lower"
        });
        const concatString = this.secret + random;
        hash.write(concatString);
        const digest = hash.digest().slice(0, this.opts.numberOfLetters);
        const ss = digest.slice(0, this.opts.numberOfLetters);
        // TODO rewrite with map() or similar
        let password = "";
        for (const c of ss) {
            password += this.opts.alphabet[c % this.opts.alphabet.length]
        }

        return password;
    }

    getImageUrl(randomString: string | undefined, base = "http://image.captchas.net/"): string {
        if (!randomString) {
            randomString = this.getRandom();
        }
        let url = `${base}?client=${this.client}&random=${randomString}`
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

    getAudioUrl(randomString: string | undefined, base = "http://audio.captchas.net/"): string {
        if (!randomString) {
            randomString = this.getRandom();
        }
        let url = `${base}?client=${this.client}&random=${randomString}`;
        if (this.opts.alphabet !== standardAlphabet) {
            url += `&alphabet=${this.opts.alphabet}`;
        }
        if (this.opts.numberOfLetters !== 6) {
            url += `&letters=${this.opts.numberOfLetters}`;
        }
        return url;
    }
}
