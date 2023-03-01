import axios from 'axios';
import Papa, { ParseRemoteConfig } from 'papaparse';

const BASE_URL = import.meta.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

interface LoadOptions {
  request?: Request;
}

export async function loadJson(
  path: string,
  { request }: LoadOptions
): Promise<unknown> {
  const res = await axiosInstance.get(path, {
    signal: request?.signal,
  });

  return await res.data;
}

export async function loadCsv(
  path: string,
  options: Partial<ParseRemoteConfig> = {}
): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(BASE_URL + path, {
      download: true,
      header: true,
      skipEmptyLines: true,

      complete(results) {
        resolve(results.data);
      },
      error(error) {
        reject(error);
      },

      ...options,
    });
  });
}
