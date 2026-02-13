import { AxiosError, isAxiosError } from 'axios';
import { callAPI } from './api_call';
import config from './config.json';

describe('callAPI', () => {
  jest.setTimeout(60 * 1000);

  it('API 호출', async () => {
    const started = new Date();

    const { apiList } = config;

    if (!apiList.some((v) => !/^_/.test(v))) {
      console.log(
        '[CALL-API] No API list. check config.json. delete "_" at apiList element',
      );
      return;
    }

    try {
      const results = await callAPI();

      const executeSeconds = new Date().getTime() - started.getTime();

      console.log(
        '[MAIN] execute %s seconds. result: %s',
        Math.floor(executeSeconds / 1000),
        JSON.stringify(results, null, 2),
      );
    } catch (e) {
      if (isAxiosError(e)) {
        console.log((e as AxiosError<string>).response?.data);
        return;
      }
      console.log('[MAIN] error. %s', (e as Error).stack);
    }
  });
});
