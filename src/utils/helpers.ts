export function mapEntries<InT, OutT>(
  dict: Record<string, InT>,
  fn: (kv: [string, InT]) => [string, OutT]
): Record<string, OutT> {
  return Object.fromEntries(Object.entries(dict).map(fn));
}
