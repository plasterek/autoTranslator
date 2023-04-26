export class TranslateException {
  constructor(error: string) {
    throw new Error(error);
  }
}
