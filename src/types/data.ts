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
   * (this is shorter than `values` e.g. if some values are not available due to filtering on other fields)
   */
  allowed: T[];
}
