import {
  Checker,
  CheckerReturnType,
  asType,
  match,
  number,
  string,
} from '@recoiljs/refine';

/**
 * Refine checker for integers serialized as string. Parses into number.
 */
export function stringifiedInt() {
  return match(
    number(),
    asType(string(), (inp) => parseInt(inp, 10))
  );
}

/**
 * Unpack complex checker return types and remove readonly modifiers.
 * This is useful when the type you'd like to just know what is the structure of the data
 * without knowing the refine returns everything as readonly
 */
type UnpackCheckerType<T extends CheckerReturnType<any>> =
  T extends (infer TElem)[]
    ? UnpackCheckerType<TElem>[]
    : T extends Record<string, any>
    ? { -readonly [P in keyof T]: UnpackCheckerType<T[P]> }
    : T;

/**
 * Use this on a checker type to get the mutable return type of the checker
 */
export type MutableCheckerReturn<T> = T extends Checker<any>
  ? UnpackCheckerType<CheckerReturnType<T>>
  : never;
