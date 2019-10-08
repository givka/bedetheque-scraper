import axiosHttpsProxyFix, {AxiosResponse} from 'axios-https-proxy-fix';
import {Proxy} from './proxy-fetcher';
import * as cheerio from 'cheerio';

export class Utils {
  static requestWithProxy(urlRaw: string, proxy: Proxy) {
    const url = encodeURI(urlRaw);
    return Utils.promiseWithTimeout(axiosHttpsProxyFix.get(url, {proxy}), 60000)
      .then((result: AxiosResponse) => {
        const $ = cheerio.load(result.data);
        if ($('title').text() == '') {
          throw new Error('IP is blacklisted');
        }
        return $;
      });
  }

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
