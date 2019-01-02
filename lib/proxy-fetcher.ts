import * as cheerio from 'cheerio';
import lodash from 'lodash';
import axiosHttpsProxyFix from 'axios-https-proxy-fix';
import { Message } from './message';

export interface ProxyType{
  host: string;
  port: number;
}

export class ProxyFetcher {
  public static async getFreeProxyList(timeout : number) {
    Message.searchingFreeProxiesList(timeout);
    const list: ProxyType[] = await axiosHttpsProxyFix
    .get(`https://proxyscrape.com/proxies/HTTP_${timeout}ms_Timeout_Proxies.txt`)
      .then(response => response.data.trim().split('\r\n')
        .map((p: string) => ({ host: p.split(':')[0], port: parseInt(p.split(':')[1], 10) })));
    Message.foundFreeProxiesList(list, timeout);
    return list;
  }

  public static async requestProxy(list: ProxyType[], urlRaw: string, nbrRetry = 5): Promise<any> {
    if (nbrRetry === 0) { return null; }
    const url = encodeURI(urlRaw);
    const proxy = this.getRandomProxy(list);
    return this.timeoutRequest(60000, axiosHttpsProxyFix.get(url, { proxy }))
      .then((result: any) => cheerio.load(result.data))
      .catch((error) => {
        console.log(`retry: ${nbrRetry} - ${url} ${error.message || error.code || error}`);
        const newNbrRetry = nbrRetry - 1;
        return this.requestProxy(list, url, newNbrRetry);
      });
  }

  private static getRandomProxy(list: ProxyType[]) {
    const indexProxy = lodash.random(list.length - 1);
    return list[indexProxy];
  }

  private static timeoutRequest(ms: number, promise: Promise<any>) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => { reject(new Error('timeout')); }, ms);
      promise.then(resolve, reject);
    }));
  }
}
