import { nullable, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const selectedVariableState = atom<string | null | undefined>({
  key: 'selectedVariable',
  default: null,
  effects: [
    urlSyncEffect({
      itemKey: 'var',
      refine: nullable(string()),
      history: 'replace',
    }),
  ],
});
