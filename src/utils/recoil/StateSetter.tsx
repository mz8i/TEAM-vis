import { useLayoutEffect } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';

interface StateSetterProps<T> {
  value: T;
  state: RecoilState<T>;
}
export const StateSetter = <T,>({ value, state }: StateSetterProps<T>) => {
  const setState = useSetRecoilState(state);

  useLayoutEffect(() => {
    setState(value);
  }, [value, state]);

  return null;
};
