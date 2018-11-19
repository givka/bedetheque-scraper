export class Utils {
  constructor() {}

  static setTimeoutPromise(ms:number) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, ms);
    });
  }
}
