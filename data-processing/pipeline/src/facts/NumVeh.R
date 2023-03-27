read_num_veh <- function(scenario_dir) {
  #' Specification for vehicle stock fact table
  read_xlsx(
    scenario_dir %//% 'Interface_VSM_NumVeh.xlsx',
    col_types = c(
      TDVSID = 'numeric',
      ScenarioID = 'numeric',
      CountryID = 'numeric',
      Year = 'numeric',
      TechID = 'numeric',
      VehCatID = 'text',
      NumVeh = 'numeric'
    )
  ) %>% 
    select(
      Year,
      TechID,
      VehCatID,
      NumVeh
    )
}

prepare_num_veh <- function(scenario_id, scenario_dir, fact_out_dir, config) {
  read_num_veh(scenario_dir) %>%
    filter_years(config$minYear, config$maxYear) %>% 
    group_by(VehCatID) %>% 
    group_walk(function(df, head) {
      category <- sanitizeSlug(head$VehCatID)
      df %>% 
        rename(Value = NumVeh) %>% 
        write_csv(
          fact_out_dir %//% str_glue("{scenario_id}__NumVeh__{category}.csv"),
          na = ''
        )
    })
}