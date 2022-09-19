import { RandomStore, RandomStoreOptions } from "./index";
import dayjs, { Dayjs } from "dayjs";

type RandomStoreEntry = {
  string: string;
  valid: boolean;
  added: Dayjs;
}

const defaultOptions: RandomStoreOptions = {
  expiryTimeSeconds: 60 * 60 * 24
}

export class MemoryRandomStore implements RandomStore {
  private opts: RandomStoreOptions;
  private validStrings: RandomStoreEntry[] = [];

  constructor(opts?: RandomStoreOptions) {
    this.opts = Object.assign({}, defaultOptions, opts);
  }

  addRandom(rs: string): boolean {
    this.expire();

    // Don't care if it's valid.
    const index = this.validStrings.findIndex((entry) => entry.string === rs);
    if (index >= 0) {
      return false;
    }

    this.validStrings.push({ string: rs, valid: true, added: dayjs() });
    return true;
  }

  validateRandom(rs: string, invalidate= true): boolean {
    this.expire();

    const index = this.validStrings.findIndex((entry) => entry.string === rs && entry.valid)
    if (index < 0) {
      return false;
    }

    if (invalidate) {
      this.validStrings[index].valid = false;
    }

    return true;
  }

  expire(): void {
    const now = dayjs();
    this.validStrings.forEach((entry) => {
      if (entry.valid) {
        // expiryTimeSeconds will exist, it comes from defaultOptions if they don't provide one.
        if (now.isAfter(entry.added.add(this.opts.expiryTimeSeconds!, "seconds"))) {
          entry.valid = false;
        }
      }
    })
  }
}
