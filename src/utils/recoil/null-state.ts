import { selector } from 'recoil';

/**
 * State always returning null.
 *
 * Use in conditional calculation of state e.g.
 *
 * ```ts
 * useRecoilValue(calculate ? expensiveState : nullState)
 * ```
 */
export const nullState = selector({
  key: 'null',
  get: () => null,
});
