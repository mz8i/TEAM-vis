import { FC, useCallback } from 'react';
import { RecoilURLSync } from 'recoil-sync';
import { RecoilURLSyncOptions } from 'recoil-sync';

export type RecoilURLSyncSimpleProps = Omit<
  RecoilURLSyncOptions,
  'serialize' | 'deserialize'
>;

const serializeSimple = (x: unknown) => (x === undefined ? '' : x + '');

const deserializeSimple = (x: string) => {
  if (x === 'true') return true;
  if (x === 'false') return false;
  return x;
};
/**
 * recoil-sync URL store that stores simple values as strings without quotes
 * (as opposed to RecoilURLSyncJSON which wraps strings in quotes)
 */
export const RecoilURLSyncSimple: FC<RecoilURLSyncSimpleProps> = (props) => {
  return (
    <RecoilURLSync
      {...props}
      serialize={serializeSimple}
      deserialize={deserializeSimple}
    />
  );
};
