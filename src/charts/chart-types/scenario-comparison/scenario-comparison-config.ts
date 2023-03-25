export function makeScenarioComparisonChartConfig(config: any) {
  return {
    operations: {
      Year: {
        aggregate: false,
        filter: [config.minYear, ...config.snapshotYears],
      },
      Scenario: {
        aggregate: false,
        filter: null,
      },
    },
  };
}
