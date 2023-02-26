import { FC, useCallback } from 'react';
import { RecoilURLSync } from 'recoil-sync';
import { RecoilURLSyncOptions } from 'recoil-sync';

export type RecoilURLSyncSimpleProps = Omit<
  RecoilURLSyncOptions,
  'serialize' | 'deserialize'
>;

/**
 * recoil-sync URL store that stores simple values as strings without quotes
 * (as opposed to RecoilURLSyncJSON which wraps strings in quotes)
 */
export const RecoilURLSyncSimple: FC<RecoilURLSyncSimpleProps> = (props) => {
  const serialize = useCallback(
    (x: unknown) => (x === undefined ? '' : x + ''),
    []
  );
  const deserialize = useCallback((x: string) => x, []);

  return (
    <RecoilURLSync {...props} serialize={serialize} deserialize={deserialize} />
  );
};
