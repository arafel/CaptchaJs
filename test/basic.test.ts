import { CaptchaJs } from "../src";

describe("constructor tests", () => {
  test('can construct', () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    expect(o).toBeDefined();
  });

  test("bad client throws", () => {
    // @ts-ignore
    expect(() => new CaptchaJs({ secret: "secret" })).toThrow('No client ID provided');
  });

  test("bad secret throws", () => {
    // @ts-ignore
    expect(() => new CaptchaJs({ client: "demo" })).toThrow('No secret provided');
  });

  test("bad alphabet throws", () => {
    expect(() => new CaptchaJs({ client: "demo", secret: "secret", alphabet: "" }))
      .toThrow("Can't use an empty alphabet");
  })

  test("bad numberOfLetters throws", () => {
    expect(() => new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 0 }))
      .toThrow("Need at least one letter");
  })
});

describe("image tests", () => {
  test("URL is returned", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const url = o.getImageUrl();
    expect(url).toMatch(/http:\/\/image\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
  });

  test("URL reflects client change", () => {
    const o = new CaptchaJs({ client: "newclient", secret: "secret" });
    const url = o.getImageUrl();
    expect(url).toMatch(/client=newclient/);
  });

  test("URL reflects base URL change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const url = o.getImageUrl({ baseURL: "newbaseurl.something.net" });
    expect(url).toMatch(/newbaseurl\.something\.net/);
  });

  test("URL reflects alphabet change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", alphabet: "abcdef" });
    const url = o.getImageUrl();
    expect(url).toMatch(/alphabet=abcdef/);
  });


  test("URL reflects number of letters change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 5 });
    const url = o.getImageUrl();
    expect(url).toMatch(/letters=5/);
  });

  test("URL reflects width change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", width: 480 });
    const url = o.getImageUrl();
    expect(url).toMatch(/width=480/);
  });

  test("URL reflects height change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url = o.getImageUrl();
    expect(url).toMatch(/height=240/);
  });

  test("specifying the random string gives the same URL", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getImageUrl({ randomString: "RandomZufall" });
    const url2 = o.getImageUrl({ randomString: "RandomZufall" });
    expect(url1).toEqual(url2);
  })

  test("not specifying the random string gives two different URLs", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getImageUrl();
    const url2 = o.getImageUrl();
    expect(url1).not.toEqual(url2);
  })
});

describe("audio tests", () => {
  test("URL is returned", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const url = o.getAudioUrl();
    expect(url).toMatch(/http:\/\/audio\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
  });

  test("URL reflects base URL change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const url = o.getAudioUrl({ baseURL: "newbaseurl.something.net" });
    expect(url).toMatch(/newbaseurl\.something\.net/);
  });

  test("URL reflects alphabet change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", alphabet: "abcdef" });
    const url = o.getAudioUrl();
    expect(url).toMatch(/alphabet=abcdef/);
  });

  test("URL reflects number of letters change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 5 });
    const url = o.getAudioUrl();
    expect(url).toMatch(/letters=5/);
  });

  test("specifying the random string gives the same URL", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getAudioUrl({ randomString: "RandomZufall" });
    const url2 = o.getAudioUrl({ randomString: "RandomZufall" });
    expect(url1).toEqual(url2);
  })

  test("not specifying the random string gives two different URLs", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getAudioUrl();
    const url2 = o.getAudioUrl();
    expect(url1).not.toEqual(url2);
  })
});

describe("random tests", () => {
  let o: CaptchaJs;

  beforeEach(() => {
    o = new CaptchaJs({ client: "demo", secret: "secret" });
  });

  test("two calls to random() get different values", () => {
    const val1 = o.getRandom();
    const val2 = o.getRandom();

    expect(val1).not.toEqual(val2);
  });
});
