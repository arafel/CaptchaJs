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
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/https:\/\/image\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
  });

  test("URL reflects client change", () => {
    const o = new CaptchaJs({ client: "newclient", secret: "secret" });
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/client=newclient/);
  });

  test("URL reflects base URL change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString()
    const url = o.getImageUrl({ randomString: rs, baseURL: "newbaseurl.something.net" });
    expect(url).toMatch(/newbaseurl\.something\.net/);
  });

  test("URL reflects alphabet change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", alphabet: "abcdef" });
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/alphabet=abcdef/);
  });


  test("URL reflects number of letters change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 5 });
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/letters=5/);
  });

  test("URL reflects width change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", width: 480 });
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/width=480/);
  });

  test("URL reflects height change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const rs = o.getRandomString();
    const url = o.getImageUrl({ randomString: rs });
    expect(url).toMatch(/height=240/);
  });

  test("specifying the random string gives the same URL", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getImageUrl({ randomString: "RandomZufall" });
    const url2 = o.getImageUrl({ randomString: "RandomZufall" });
    expect(url1).toEqual(url2);
  })
});

describe("audio tests", () => {
  test("URL is returned", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString()
    const url = o.getAudioUrl({ randomString: rs });
    expect(url).toMatch(/https:\/\/audio\.captchas\.net\/\?client=demo&random=\w\w\w\w\w\w/);
  });

  test("URL reflects base URL change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString()
    const url = o.getAudioUrl({ randomString: rs, baseURL: "newbaseurl.something.net" });
    expect(url).toMatch(/newbaseurl\.something\.net/);
  });

  test("URL reflects alphabet change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", alphabet: "abcdef" });
    const rs = o.getRandomString()
    const url = o.getAudioUrl({ randomString: rs });
    expect(url).toMatch(/alphabet=abcdef/);
  });

  test("URL reflects number of letters change", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", numberOfLetters: 5 });
    const rs = o.getRandomString()
    const url = o.getAudioUrl({ randomString: rs });
    expect(url).toMatch(/letters=5/);
  });

  test("specifying the random string gives the same URL", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret", height: 240 });
    const url1 = o.getAudioUrl({ randomString: "RandomZufall" });
    const url2 = o.getAudioUrl({ randomString: "RandomZufall" });
    expect(url1).toEqual(url2);
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
    expect(() => o.makePassword(undefined)).toThrow('No random string supplied');
  })

  test("returns the same password with the same random string", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const password1 = o.makePassword("I am a random string");
    const password2 = o.makePassword("I am a random string");
    expect(password1).toEqual(password2);
  })
})

describe("random string validation", () => {
  let o;

  beforeEach(() => {
    o = new CaptchaJs({ client: "demo", secret: "secret" });
  });

  test("reject a random string we didn't generate", () => {
    expect(o.validateRandomString("I am a test string")).toBeFalsy();
  })

  test("accept a random string we did generate", () => {
    const randomString = o.getRandomString();
    expect(o.validateRandomString(randomString)).toBeTruthy();
  })

  test("can only use a random string once", () => {
    const randomString = o.getRandomString();
    expect(o.validateRandomString(randomString)).toBeTruthy();
    expect(o.validateRandomString(randomString)).toBeFalsy();
  })
});

describe("password checks", () => {
  test("valid password with matching random string passes", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    const password = o.makePassword(rs);
    expect(o.verifyPassword(rs, password)).toBeTruthy();
  })

  test("password that's too long gets rejected", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    expect(o.verifyPassword(rs, "too long")).toBeFalsy();
  })

  test("valid password with different random string fails", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    const otherRs = o.getRandomString();
    const password = o.makePassword(rs);
    expect(o.verifyPassword(otherRs, password)).toBeFalsy();
  })

  test("invalid password with valid random string is rejected", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    expect(o.verifyPassword(rs, "abcdef")).toBeFalsy();
  })

  test("empty password with valid random string is rejected", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    expect(o.verifyPassword(rs, undefined)).toBeFalsy();
  })

  test("valid password with empty random string is rejected", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    expect(o.verifyPassword(undefined, "abcdef")).toBeFalsy();
  })

  test("empty password with empty random string is rejected", () => {
    const o = new CaptchaJs({ client: "demo", secret: "secret" });
    const rs = o.getRandomString();
    expect(o.verifyPassword(undefined, undefined)).toBeFalsy();
  })
})
