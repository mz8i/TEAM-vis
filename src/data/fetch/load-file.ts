import Papa, { ParseWorkerConfig } from 'papaparse';
import wretchLib from 'wretch';
import AbortAddon from 'wretch/addons/abort';

import { queryClient } from '../../query-client';

const BASE_URL = import.meta.env.BASE_URL;
export const wretch = wretchLib(BASE_URL, {}).addon(AbortAddon());

async function loadJson<T = unknown>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  return wretch.options({ signal }).get(path).json();
}

async function queryFile(
  url: string,
  signal: AbortSignal | undefined,
  fileFunction: (url: string, signal?: AbortSignal) => Promise<any>
) {
  if (signal != null) {
    signal.onabort = () => {
      queryClient.cancelQueries({
        queryKey: [url],
      });
    };
  }

  return await queryClient.fetchQuery(
    [url],
    ({ queryKey: [url], signal }) => fileFunction(url, signal),
    {
      staleTime: Infinity,
    }
  );
}

export async function queryJson(
  url: string,
  signal?: AbortSignal
): Promise<any> {
  return queryFile(url, signal, loadJson);
}

async function loadCsv(
  path: string,
  options: Partial<ParseWorkerConfig> = {},
  signal?: AbortSignal
): Promise<any> {
  const res = await wretch.options({ signal }).get(path).text();

  return new Promise<any>((resolve, reject) => {
    Papa.parse(res, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      download: false,

      complete(results) {
        resolve(results.data);
      },
      error(err: any) {
        reject(err);
      },

      ...options,
    });
  });
}

export async function queryCsv(
  url: string,
  options: Partial<ParseWorkerConfig> = {},
  signal?: AbortSignal
) {
  return queryFile(url, signal, (url, signal) => loadCsv(url, options, signal));
}
