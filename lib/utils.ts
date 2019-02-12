export class Utils {
  static setTimeoutPromise(ms:number) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, ms);
    });
  }

  static urlToSerieID(url: string) {
    const match = url.match(/serie-([0-9]+)-/);
    return  match ? parseInt(match[1] , 10) : 0 ;
  }
}
