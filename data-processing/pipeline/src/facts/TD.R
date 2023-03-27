

read_td <- function(scenario_dir) {
  read_xlsx(
    scenario_dir %//% 'Mode_Shares_TripLength.xlsx',
    col_types = c(
      ScenarioID = 'numeric',
      CountryID = 'numeric',
      PolicyID = 'numeric',
      Year = 'numeric',
      triplenID = 'numeric',
      modeID = 'numeric',
      td = 'numeric'
    )
  ) %>% 
    select(
      Year,
      triplenID,
      modeID,
      td
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