read_veh_km <- function(scenario_dir) {
  #' Specification for the vehicle kilometres fact table
  read_xlsx(
    scenario_dir %//% 'Interface_VSM_VehKM.xlsx',
    col_types = c(
      TDVSID = 'numeric',
      ScenarioID = 'numeric',
      CountryID = 'numeric',
      Year = 'numeric',
      TechID = 'numeric',
      JSTypeID = 'numeric',
      VehKM = 'numeric',
      AveTripLength = 'numeric',
      LoadFactor = 'numeric'
    )
  ) %>% 
    select(
      Year,
      TechID,
      JSTypeID,
      VehKM
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