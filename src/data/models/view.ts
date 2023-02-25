import { CheckerReturnType, object, string } from '@recoiljs/refine';

export const viewChecker = object({
  slug: string(),
  label: string(),
});

export type View = CheckerReturnType<typeof viewChecker>;
