import { FC, Suspense, startTransition, useEffect } from 'react';
import {
  RecoilState,
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE,
  useSetRecoilState,
} from 'recoil';

export function ConcurrentSetter<T>({
  value,
  state,
}: {
  value: T;
  state: RecoilState<T>;
}) {
  return (
    <Suspense fallback={<FallbackSetter value={value} state={state} />}>
      <ConcurrentSetterImpl value={value} state={state} />
    </Suspense>
  );
}

function ConcurrentSetterImpl<T>({
  value,
  state,
}: {
  value: T;
  state: RecoilState<T>;
}) {
  const [, setState] = useRecoilState_TRANSITION_SUPPORT_UNSTABLE(state);

  useEffect(() => {
    startTransition(() => {
      setState(value);
    });
  }, [value]);

  return null;
}

function FallbackSetter<T>({
  value,
  state,
}: {
  value: T;
  state: RecoilState<T>;
}) {
  const setState = useSetRecoilState(state);

  useEffect(() => {
    setState(value);
  }, [value]);

  return null;
}
