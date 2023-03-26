import {
  RecoilValueReadOnly,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  useRecoilValue,
} from 'recoil';

export function useConcurrentValue<T>(state: RecoilValueReadOnly<T>) {
  const valuePotentiallyDeferred =
    useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(state);
  const freshValue = useRecoilValue(state);

  const loadingNew = freshValue !== valuePotentiallyDeferred;

  return {
    value: valuePotentiallyDeferred,
    loadingNew: loadingNew,
    newValue: freshValue,
  };
}
