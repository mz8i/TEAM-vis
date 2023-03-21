read_scenarios_meta <- function(root_in_dir) {
  #' Specification for the manual Scenarios.csv file
  read_csv(
    root_in_dir %//% 'manual/Scenarios.csv',
    col_types = cols(
      ScenarioID = 'i',
      ScenarioAB = 'c',
      ScenarioNA = 'c',
      Description = 'c'
    )
  )
}


prepare_scenarios_json <- function(in_dir, out_dir) {
  read_scenarios_meta(in_dir) %>% 
    rename(
      id=ScenarioID,
      slug=ScenarioAB,
      name=ScenarioNA,
      description=Description
    ) %>% 
    write_json(out_dir %//% 'scenarios.json')
}