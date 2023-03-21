
source('./src/facts/NumVeh.R')
source('./src/facts/VehKM.R')
source('./src/facts/emissions.R')
source('./src/facts/TD.R')


prepare_scenario_facts <- function(scenario_id, scenario_in_dir, fact_out_dir, emission_meta, config) {
  prepare_num_veh(scenario_id, scenario_in_dir, fact_out_dir)
  prepare_veh_km(scenario_id, scenario_in_dir, fact_out_dir)
  prepare_emissions(scenario_id, scenario_in_dir, fact_out_dir, emission_meta)
  prepare_td(scenario_id, scenario_in_dir, fact_out_dir, config)
  
  return(TRUE)
}


check_scenario_abs_valid <- function(subdirectories, scenario_ab_values) {
  not_matched <- setdiff(subdirectories, scenario_ab_values)
  assert(
    str_glue("Scenario subdirectories: {paste(not_matched, collapse=', ')} are missing a matching ScenarioAB in Scenarios.csv"),
    length(not_matched) == 0
  )
  
  not_matched <- setdiff(scenario_ab_values, subdirectories)
  assert(
    str_glue("ScenarioAB values in Scenarios.csv: {paste(not_matched, collapse=', ')} are missing a matching scenario subdirectory")
  )
}

read_scenario_subdirectories <- function(root_in_dir) {
  #' Specification for the extract/scenarios directory
  
  scenarios_metadata <- read_scenarios_meta(root_in_dir)
  
  all_scenarios_dir <- root_in_dir %//% 'extract/scenarios'
  
  scenario_subdirectories <- dir(all_scenarios_dir, full.names = F, recursive=F)
  
  check_scenario_abs_valid(scenario_subdirectories, scenarios_metadata$ScenarioAB)
  
  tibble(ScenarioAB = scenario_subdirectories) %>%
    left_join(scenarios_metadata, by = 'ScenarioAB') %>% 
    mutate(FolderPath = all_scenarios_dir %//% ScenarioAB) %>%
    # return only ScenarioID and FolderPath columns
    select(
      ScenarioID,
      FolderPath
    )
}

read_config <- function(in_dir) {
  read_json(
    in_dir %//% 'manual/config.json'
  )
}


prepare_facts <- function(in_dir, out_dir) {
  fact_out_dir <- out_dir %//% 'tables/facts'
  dir.create(fact_out_dir, recursive=T, showWarnings = F)
  
  config <- read_config(in_dir)
  emission_meta <- read_emission_meta(in_dir)
  
  prepare_emission_lookups(out_dir %//% 'tables/dimensions', emission_meta)
  
  read_scenario_subdirectories(in_dir) %>%
    rowwise() %>% 
    mutate(result = prepare_scenario_facts(ScenarioID, FolderPath, fact_out_dir, emission_meta, config))
}