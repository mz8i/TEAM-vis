export interface DataSeries<RowType extends object> {
  GroupKey: string;
  GroupLabel: string;
  Grouping: any;
  Rows: RowType[];
}
