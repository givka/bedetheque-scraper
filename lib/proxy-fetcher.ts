import axiosHttpsProxyFix, {AxiosResponse} from 'axios-https-proxy-fix';

export interface Proxy {
  host: string;
  port: number;
}

export class ProxyFetcher {

  static async getProxyList(timeout = 5000) {
    return await axiosHttpsProxyFix.get(`https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=${timeout}`)
      .then((response: AxiosResponse) => response.data.trim().split('\r\n')
        .map((p: string) => ({
          host: p.split(':')[0],
          port: parseInt(p.split(':')[1], 10)
        })) as Proxy[]);
  }
}
