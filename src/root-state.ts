import { atom, useRecoilValue } from 'recoil';

import { ConfigType } from './data/fetch/models/config';

export const configState = atom<ConfigType>({
  key: 'config',
  default: new Promise(() => {}),
});

export function useConfig() {
  return useRecoilValue(configState);
}
