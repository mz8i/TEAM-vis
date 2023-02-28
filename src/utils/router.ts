import { Checker, assertion } from '@recoiljs/refine';
import { LoaderFunctionArgs, useLoaderData } from 'react-router';

import { MutableCheckerReturn } from './recoil/refine';

export type UnknownValues<T extends object> = {
  [P in keyof T]: unknown;
};

export type TypedLoaderFunction<T extends object> = (
  args: LoaderFunctionArgs
) => Promise<UnknownValues<T>> | UnknownValues<T>;

export function useCheckedLoaderData<T>(checker: Checker<T>) {
  const data = useLoaderData();

  // TODO: if we're removing the readonly attributes, should the result be deep cloned?
  return assertion(checker)(data) as MutableCheckerReturn<Checker<T>>;
}
