import { atom } from 'recoil';

import { DataViewParams } from './fact-state';

export const currentDataViewParamsState = atom<DataViewParams>({
  key: 'currentdataViewParams',
  default: new Promise(() => {}),
});
