import { Checker, assertion } from '@recoiljs/refine';
import { LoaderFunctionArgs, useLoaderData } from 'react-router';

export type UnknownValues<T extends object> = {
  [P in keyof T]: unknown;
};

export type TypedLoaderFunction<T extends object> = (
  args: LoaderFunctionArgs
) => Promise<UnknownValues<T>> | UnknownValues<T>;

export function useCheckedLoaderData<T>(checker: Checker<T>): T {
  const data = useLoaderData();

  return assertion(checker)(data);
}
