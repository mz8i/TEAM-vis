

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
    filter(
      Year >= config$td_min_year,
      Year <= config$td_max_year
    ) %>% 
    write_csv(
      fact_out_dir %//% str_glue("{scenario_id}__TD.csv"),
      na = ''
    )
}