"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe("constructor tests", () => {
    test('can construct', () => {
        const o = new src_1.CaptchaJs("demo", "secret");
        expect(o).toBeDefined();
    });
    test("bad client throws", () => {
        expect(() => new src_1.CaptchaJs(undefined, "secret")).toThrow('No client ID provided');
    });
    test("bad secret throws", () => {
        expect(() => new src_1.CaptchaJs("demo", undefined)).toThrow('No secret provided');
    });
});
describe("image tests", () => {
    test("URL is returned", () => {
        const o = new src_1.CaptchaJs("demo", "secret");
        const url = o.getImageUrl();
        expect(url).toMatch(/http:\/\/image\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
    });
    test("URL reflects client change", () => {
        const o = new src_1.CaptchaJs("newclient", "secret");
        const url = o.getImageUrl();
        expect(url).toMatch(/client=newclient/);
    });
    test("URL reflects base URL change", () => {
        const o = new src_1.CaptchaJs("demo", "secret");
        const url = o.getImageUrl(undefined, "newbaseurl.something.net");
        expect(url).toMatch(/newbaseurl\.something\.net/);
    });
    test("URL reflects alphabet change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { alphabet: "abcdef" });
        const url = o.getImageUrl();
        expect(url).toMatch(/alphabet=abcdef/);
    });
    test("URL reflects number of letters change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { numberOfLetters: 5 });
        const url = o.getImageUrl();
        expect(url).toMatch(/letters=5/);
    });
    test("URL reflects width change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { width: 480 });
        const url = o.getImageUrl();
        expect(url).toMatch(/width=480/);
    });
    test("URL reflects height change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { height: 240 });
        const url = o.getImageUrl();
        expect(url).toMatch(/height=240/);
    });
});
describe("audio tests", () => {
    test("URL is returned", () => {
        const o = new src_1.CaptchaJs("demo", "secret");
        const url = o.getAudioUrl();
        expect(url).toMatch(/http:\/\/audio\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
    });
    test("URL reflects base URL change", () => {
        const o = new src_1.CaptchaJs("demo", "secret");
        const url = o.getAudioUrl(undefined, "newbaseurl.something.net");
        expect(url).toMatch(/newbaseurl\.something\.net/);
    });
    test("URL reflects alphabet change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { alphabet: "abcdef" });
        const url = o.getAudioUrl();
        expect(url).toMatch(/alphabet=abcdef/);
    });
    test("URL reflects number of letters change", () => {
        const o = new src_1.CaptchaJs("demo", "secret", { numberOfLetters: 5 });
        const url = o.getAudioUrl();
        expect(url).toMatch(/letters=5/);
    });
});
describe("random tests", () => {
    let o;
    beforeEach(() => {
        o = new src_1.CaptchaJs("demo", "secret");
    });
    test("two calls to random() get different values", () => {
        const val1 = o.getRandom();
        const val2 = o.getRandom();
        expect(val1).not.toEqual(val2);
    });
});
