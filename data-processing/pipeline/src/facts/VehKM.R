read_veh_km <- function(scenario_dir) {
  #' Specification for the vehicle kilometres fact table
  read_csv(
    scenario_dir %//% 'Interface_VSM_VehKM.csv',
    col_types = cols_only(
      Year = 'i',
      TechID = 'i',
      JSTypeID = 'i',
      VehKM = 'n',
    )
  )
}

prepare_veh_km <- function(scenario_id, scenario_dir, fact_out_dir, config) {
  read_veh_km(scenario_dir) %>% 
    rename(Value = VehKM) %>%
    filter_years(config$minYear, config$maxYear) %>% 
    write_csv(
      fact_out_dir %//% str_glue("{scenario_id}__VehKM.csv"),
      na = ''
    )
}