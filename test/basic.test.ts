import { CaptchaJs } from "../src";

describe("constructor tests", () => {
  test('can construct', () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    expect(o).toBeDefined();
  });

  test("bad client throws", () => {
    // Ignore as we're deliberately missing a parameter.
    // @ts-ignore
    expect(() => new CaptchaJs({ secret: "secret" })).toThrow('No client ID provided');
  });

  test("bad secret throws", () => {
    // Ignore as we're deliberately missing a parameter.
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
    expect(url).toMatch(/https:\/\/image\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
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
    expect(url).toMatch(/https:\/\/audio\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
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

describe("getRandomString", () => {
  let o: CaptchaJs;

  beforeEach(() => {
    o = new CaptchaJs({ client: "demo", secret: "secret" });
  });

  test("two calls to random() get different values", () => {
    const val1 = o.getRandomString();
    const val2 = o.getRandomString();

    expect(val1).not.toEqual(val2);
  });
});

describe("makePassword", () => {
  test("returns a password of the right length", () => {
    let o = new CaptchaJs({ client: "demo", secret: "secret" });
    expect(o.makePassword("I am a random string")).toHaveLength(6);

    o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 3 });
    expect(o.makePassword("I am a random string")).toHaveLength(3);

    o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 8 });
    expect(o.makePassword("I am a random string")).toHaveLength(8);
  })

  test("throws if not given a random string", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    // Ignore as we're deliberately missing a parameter.
    // @ts-ignore
    expect(() => o.makePassword()).toThrow('No random string supplied');
  })

  test("returns the same password with the same random string", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const password1 = o.makePassword("I am a random string");
    const password2 = o.makePassword("I am a random string");
    expect(password1).toEqual(password2);
  })
})
