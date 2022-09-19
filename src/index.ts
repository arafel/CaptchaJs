import { MemoryRandomStore} from "./memory_randomstore";
import { CaptchaJs } from "./captchajs";

export { CaptchaJs, MemoryRandomStore };

export interface CaptchaJsOptions {
  client: string,
  secret: string,
  numberOfLetters?: number;
  width?: number;
  height?: number;
  alphabet?: string;
  randomStore?: RandomStore;
}

export interface GetImageUrlOptions {
  randomString: string;
  baseURL?: string;
}

export interface GetAudioUrlOptions {
  randomString: string;
  baseURL?: string;
}

export interface RandomStoreOptions {
  expiryTimeSeconds?: number;
}

export interface RandomStore {
  addRandom(rs: string): boolean;
  validateRandom(rs: string, invalidate: boolean): boolean;
  expire(): void;
}
