import { RandomStoreOptions, MemoryRandomStore } from "../src";

describe("memory store", () => {
  test("can't add the same string twice", () => {
    const store = new MemoryRandomStore();
    expect(store.addRandom("random string")).toBeTruthy()
    expect(store.addRandom("random string")).toBeFalsy()
  })

  test("can't validate the same string twice if invalidate is set", () => {
    const store = new MemoryRandomStore();
    expect(store.addRandom("random string")).toBeTruthy()
    expect(store.validateRandom("random string")).toBeTruthy()
    expect(store.validateRandom("random string")).toBeFalsy()
  })

  test("can validate the same string twice if invalidate is set to false", () => {
    const store = new MemoryRandomStore();
    expect(store.addRandom("random string")).toBeTruthy()
    expect(store.validateRandom("random string", false)).toBeTruthy()
    expect(store.validateRandom("random string")).toBeTruthy()
    expect(store.validateRandom("random string")).toBeFalsy()
  })

  test("can't use a string after it expires", (done) => {
    const options: RandomStoreOptions = {
      expiryTimeSeconds: 1
    }
    const store = new MemoryRandomStore(options);
    expect(store.addRandom("random string")).toBeTruthy();
    setTimeout(() => {
      try {
        expect(store.validateRandom("random string")).toBeFalsy();
        done();
      } catch (error) {
        done(error);
      }
    }, 1000 * (options.expiryTimeSeconds! + 1))
  })
})
