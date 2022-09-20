import { RandomStore, RandomStoreOptions } from "./index";
import dayjs, { Dayjs } from "dayjs";
import * as util from "node:util";

type RandomStoreEntry = {
  string: string;
  valid: boolean;
  added: Dayjs;
}

const logger = util.debuglog('captchajs:randomstore:memory');

const defaultOptions: RandomStoreOptions = {
  expiryTimeSeconds: 60 * 60 * 24
}

export class MemoryRandomStore implements RandomStore {
  private opts: RandomStoreOptions;
  private validStrings: RandomStoreEntry[] = [];

  constructor(opts?: RandomStoreOptions) {
    logger("Constructing with options", opts);
    this.opts = Object.assign({}, defaultOptions, opts);
    logger("this.opts", this.opts);
  }

  addRandom(rs: string): boolean {
    this.expire();

    // Don't care if it's valid.
    logger("Checking if", rs, "is already recorded")
    const index = this.validStrings.findIndex((entry) => entry.string === rs);
    if (index >= 0) {
      logger("It is, reject.")
      return false;
    }

    this.validStrings.push({ string: rs, valid: true, added: dayjs() });
    logger("Accepted string");
    return true;
  }

  validateRandom(rs: string, invalidate= true): boolean {
    this.expire();

    logger("Validating random string", rs, "- invalidate after?", invalidate);
    const index = this.validStrings.findIndex((entry) => entry.string === rs && entry.valid)
    if (index < 0) {
      logger("String not found");
      return false;
    } else {
      logger("Found at position", index);
    }

    if (invalidate) {
      logger("Marking no longer valid");
      this.validStrings[index].valid = false;
    }

    return true;
  }

  expire(): void {
    const now = dayjs();
    logger("Running expiry");
    this.validStrings.forEach((entry) => {
      if (entry.valid) {
        // expiryTimeSeconds will exist, it comes from defaultOptions if they don't provide one.
        if (now.isAfter(entry.added.add(this.opts.expiryTimeSeconds!, "seconds"))) {
          logger("Expiring entry", entry);
          entry.valid = false;
        }
      }
    })
  }
}
