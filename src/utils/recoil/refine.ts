import { asType, match, number, string } from '@recoiljs/refine';

/**
 * Refine checker for integers serialized as string. Parses into number.
 */
export function stringifiedInt() {
  return match(
    number(),
    asType(string(), (inp) => parseInt(inp, 10))
  );
}
