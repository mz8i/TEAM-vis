import { ReactNode, createContext, useContext } from 'react';

import { useConcurrentValue } from '../../utils/recoil/use-concurrent-value';
import { currentDataViewParamsState } from './data-view-state';
import { DataViewParams } from './fact-state';

export const DataViewParamsContext = createContext<{
  value: DataViewParams;
  newValue: DataViewParams;
  loadingNew: boolean;
} | null>(null);

export function DataViewParamsRoot({ children }: { children: ReactNode }) {
  const dataViewParamsConcurrent = useConcurrentValue(
    currentDataViewParamsState
  );

  return (
    <DataViewParamsContext.Provider value={dataViewParamsConcurrent}>
      {children}
    </DataViewParamsContext.Provider>
  );
}

export function useDataViewParamsConcurrent() {
  const value = useContext(DataViewParamsContext);

  if (value == null)
    throw new Error(
      'Unexpected error: data view params context not initialised'
    );

  return value;
}
