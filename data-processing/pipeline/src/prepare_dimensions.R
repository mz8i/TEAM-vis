
prepare_technology <- function(in_file, out_file) {
  read_csv(in_file) %>%
    select(
      ID = TechID,
      ModeID,
      VehTypeID,
      MassCatID,
      FuelID,
      EngineID,
      TransTypeID,
      HybridID = HybridFlag,
      SecondHandImportID = SecondHandImportFlag 
    ) %>%
    write_csv(out_file)
}


prepare_std_lookup <- function(prefix, in_file, out_file) {
  #' Process single lookup/dimension file in a standardized format
  #' 
  #' Should have columns:
  #' <prefix>ID
  #' <prefix>NA
  #' <prefix>AB (optional)
  #' 
  #' Will output file with ID, NA, (AB) columns

  read_csv(in_file) %>% 
    # select [prefix]ID, [prefix]AB, [prefix]NA columns
    select(
      any_of(
        prefix %.% c('ID', 'AB', 'NA')
      )
    ) %>% 
    # leave only ID / AB / NA as column names
    rename_with(.fn = \(x) str_sub(x, -2)) %>%
    # write to CSV
    write_csv(out_file)
  
  return(out_file)
}


prepare_lookups <- function(in_root_dir, out_dimensions_dir) {
  
  quirky_tables <- tibble(Path=character(),Prefix=character())
  
  dimensions_in_dir <- in_root_dir %//% 'extract/dimensions'
  
  tmpd <- tempdir()
  
  # EmissionType -> ETypeID
  quirky_tables <- add_row(quirky_tables,
                           Path = dimensions_in_dir %//% 'EmissionType.csv', Prefix='EType')
  
  # Trip_lengths -> TripLenID
  read_csv(dimensions_in_dir %//% 'Trip_lengths.csv') %>% 
    rename(
      TripLenID = triplenID,
      TripLenNA = triplenName
    ) %>% 
    write_csv(tmpd %//% 'TripLenID.csv')
  quirky_tables <- add_row(quirky_tables,
                           Path = tmpd %//% 'TripLenID.csv', Prefix = 'TripLen')
  
  # MS_modes -> MSModeID
  read_csv(dimensions_in_dir %//% 'MS_modes.csv') %>% 
    rename(
      MSModeID = modeID,
      MSModeNA = modeName
    ) %>% 
    write_csv(tmpd %//% 'MSModeID.csv')
  quirky_tables <- add_row(quirky_tables,
                           Path = tmpd %//% 'MSModeID.csv', Prefix = 'MSMode')
  
  
  # add tables from manual folder
  manual_in_dir <- in_root_dir %//% 'manual'
  
  manual_tables <- tibble(Prefix = c('SecondHandImport', 'Hybrid')) %>% 
    mutate(Path = manual_in_dir %//% (Prefix %.% 'ID.csv'))
  

  # add standard tables
  std_tables <- tibble(
    Prefix=c(
      'VehType', 
      'TransType',
      'MassCat',
      'Fuel',
      'Engine',
      'VehCat',
      'JSType',
      'Emission'
    )
  ) %>% mutate(Path = dimensions_in_dir %//% (Prefix %.% 'ID.csv'))
  
  # merge all lists together
  all_tables <- bind_rows(std_tables, manual_tables, quirky_tables)
  
  results <- all_tables %>% 
    rowwise() %>%
    mutate(result_file = prepare_std_lookup(
      Prefix,
      Path,
      out_dimensions_dir %//% (Prefix %.% '.csv')
    ))
  
  return(results$result_file)
}


prepare_dimensions <- function(in_dir, out_dir) {
  in_dim <- in_dir %//% 'extract/dimensions'
  out_dim <- out_dir %//% 'tables/dimensions'
  
  # make sure the output directory exists
  dir.create(out_dim, recursive=T, showWarnings = F)
  
  # process Technology table
  prepare_technology(
    in_dim %//% 'Technology.csv',
    out_dim %//% 'Tech.csv'
  )
  
  # process all lookup tables
  prepare_lookups(in_dir, out_dim)
}


