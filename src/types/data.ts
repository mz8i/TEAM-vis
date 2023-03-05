/**
 * Specification object for data transformations to perform on a single variable.
 * Defines aggregation (summing up over variable) or disaggregation (splitting by variable),
 * also defines filtering of variable values.
 */
export interface DataSelectionValue<T> {
  /**
   * Should the data be aggregated across all possible values of this domain,
   * e.g. charts are not disaggregated by Fuel Type - data points for all fuel types are summed up.
   */
  aggregate: boolean;

  /**
   * Array of values to keep. If empty, filter everything out. If null, don't filter anything out.
   */
  filter: T[] | null;
}

export interface DataDomain<T> {
  /**
   * All possible values in the domain
   */
  values: T[];

  /**
   * Currently allowed values for the domain
   * This is shorter than `values` e.g. if some values are not available due to filtering on other fields
   * that have a higher priority than others.
   */
  allowed: T[];

  /**
   * Values that are currently visible in a data view.
   * This can be used to indicate that some values, while allowed, are not shown in the data right now
   * because of combinations of other filters of the same priority as this one.
   * The result can be a value label in a select list being grayed out, but the user still being able to
   * toggle the selection on/off.
   */
  shown: T[];
}

export type LabelFn<T> = (x: T) => string;
