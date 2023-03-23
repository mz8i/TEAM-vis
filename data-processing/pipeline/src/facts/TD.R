

read_td <- function(scenario_dir) {
  read_csv(
    scenario_dir %//% 'Mode_Shares_TripLengths.csv',
    col_types = cols_only(
      Year = 'i',
      triplenID = 'i',
      modeID = 'i',
      td = 'n'
    )
  )
}

prepare_td <- function(scenario_id, scenario_dir, fact_out_dir, config) {
  read_td(scenario_dir) %>% 
    rename(
      TripLenID = triplenID,
      MSModeID = modeID,
      Value = td
    ) %>% 
    filter_years(
      config$minYear,
      config$maxYear
    ) %>% 
    write_csv(
      fact_out_dir %//% str_glue("{scenario_id}__TD.csv"),
      na = ''
    )
}