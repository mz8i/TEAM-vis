read_emission_meta_manual <- function(root_dir) {
  read_csv(
    root_dir %//% 'manual/Emission.csv',
    col_types = cols_only(
      EmissionID = 'i',
      GreenhouseGasFlag = 'l',
      AirPollutantFlag = 'l',
      GWP = 'd'
    )
  )
}

read_emission_meta_extract <- function(root_dir) {
  read_csv(
    root_dir %//% 'extract/dimensions/EmissionID.csv',
    col_types = cols_only(
      EmissionID = 'i',
      EmissionAB = 'c',
      EmissionNA = 'c'
    )
  )
}

read_emission_meta <- function(root_dir) {
  inner_join(
    read_emission_meta_extract(root_dir),
    read_emission_meta_manual(root_dir),
    by = "EmissionID"
  )
}