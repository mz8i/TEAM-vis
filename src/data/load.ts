import { Checker, CheckerReturnType, assertion } from '@recoiljs/refine';
import axios from 'axios';
import { request } from 'http';

interface LoadOptions {
  request?: Request;
}

export async function load(
  path: string,
  { request }: LoadOptions
): Promise<unknown> {
  const res = await axios.get(path, {
    signal: request?.signal,
  });

  return await res.data;
}
