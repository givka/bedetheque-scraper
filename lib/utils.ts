export class Utils {
  static sleepFor(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  static promiseWithTimeout(promise: Promise<any>, ms: number) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      promise.then(resolve, reject);
    }));
  }

  static urlToSerieID(url: string) {
    const match = url.match(/serie-([0-9]+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static raceFirstSuccess(promises: Promise<any>[]) {
    return Promise.all(promises.map(p => p.then(val => Promise.reject(val), err => Promise.resolve(err))))
      .then(errors => Promise.reject(errors), val => Promise.resolve(val));
  }
}
