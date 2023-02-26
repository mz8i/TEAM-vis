import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

interface LoadOptions {
  request?: Request;
}

export async function load(
  path: string,
  { request }: LoadOptions
): Promise<unknown> {
  const res = await axiosInstance.get(path, {
    signal: request?.signal,
  });

  return await res.data;
}
