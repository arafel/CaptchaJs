interface CaptchaJs {
    constructor(client: string,
        secret: string,
        numberOfLetters: number): CaptchaJs;

    getRandom(): string;
    getVideoUrl(): string;
    getAudioUrl(): string;
}

type CaptchaJsOptions = {
    numberOfLetters: number;
    width: number;
    height: number;
    alphabet: string;
};
export CaptchaJsOptions
