read_ed <- function(scenario_dir) {
  read_csv(
    scenario_dir %//% 'ED.csv',
    col_types = cols_only(
      Year = 'i',
      TechID = 'i',
      JSTypeID = 'i',
      EmissionID = 'i',
      ETypeID = 'c',
      ED_Value = 'n',
      ED_PFix = 'c',
      ED_Unit = 'c'
    )
  )
}

preproc_ed <- function(ed) {
  ed %>%
    # sum over JSTypeID, we don't need it
    group_by(across(-c(JSTypeID, ED_Value))) %>% 
    summarise(
      ED_Value = sum(ED_Value)
    ) %>% 
    mutate(Unit = paste0(ED_PFix, ED_Unit), .keep='unused') %>% 
    rename(Value = ED_Value)
}

read_et <- function(scenario_dir) {
  read_csv(
    scenario_dir %//% 'ET.csv',
    col_types = cols_only(
      Year = 'i',
      TechID = 'i',
      EmissionID = 'i',
      ETypeID = 'c',
      ET_Value = 'n',
      ET_PFix = 'c',
      ET_Unit = 'c'
    )
  )
}

preproc_et <- function(et) {
  et %>% 
    mutate(Unit = paste0(ET_PFix, ET_Unit), .keep = 'unused') %>% 
    rename(Value = ET_Value)
}

verify_single_unit <- function(df) {
  units <- unique(df$Unit)
  assert(
    str_glue('Multiple units in one emissions table: {paste(units, collapse=", ")}'),
    length(units) == 1
  )
  
  df
}

prepare_ghg <- function(emissions_df, emission_meta, scenario_id, scenario_dir, fact_out_dir) {
  emission_meta %>% 
    filter(GreenhouseGasFlag) %>%
    select(EmissionID, GWP) %>% 
    left_join(emissions_df, by='EmissionID', multiple = 'all') %>%
    mutate(Value = Value * GWP, .keep='unused') %>%
    group_by(ETypeID) %>% 
    group_walk(function(df, head) {
      etype <- sanitizeSlug(head$ETypeID)
      df %>% 
        verify_single_unit %>% 
        write_csv(
          fact_out_dir %//% str_glue("{scenario_id}__GHG__{etype}.csv"),
          na = ''
        )
    })
}

prepare_ap <- function(emissions_df, emission_meta, scenario_id, scenario_dir, fact_out_dir) {
  emission_meta %>% 
    filter(AirPollutantFlag) %>% 
    select(EmissionID, EmissionAB) %>% 
    left_join(emissions_df, by='EmissionID', multiple = 'all') %>% 
    group_by(EmissionAB) %>% 
    group_walk(function(df, head) {
      emission_ab <- sanitizeSlug(head$EmissionAB)
      df %>% 
        verify_single_unit %>% 
        write_csv(
          fact_out_dir %//% str_glue("{scenario_id}__AP__{emission_ab}.csv"),
          na = ''
        )
    })
}

preprocess_emissions <- function(df) {
  df %>% 
    # divide by a million to get values in megatonnes
    mutate(Value = Value / 1000000)
}

prepare_emissions <- function(scenario_id, scenario_dir, fact_out_dir, config, emission_meta) {
  et <- read_et(scenario_dir) %>% 
    preproc_et()
  
  ed <- read_ed(scenario_dir) %>% 
    preproc_ed()
  
  emissions <- bind_rows(ed, et) %>%
    filter_years(config$minYear, config$maxYear) %>% 
    preprocess_emissions()

  prepare_ghg(emissions, emission_meta, scenario_id, scenario_dir, fact_out_dir)
  prepare_ap(emissions, emission_meta, scenario_id, scenario_dir, fact_out_dir)
}

prepare_emission_lookups <- function(dimensions_out_dir, emission_meta) {
  emission_meta %>% 
    filter(AirPollutantFlag) %>% 
    select(
      ID = EmissionID,
      AB = EmissionAB,
      `NA` = EmissionNA
    ) %>% 
    write_csv(
      dimensions_out_dir %//% 'APEmission.csv'
    )
}