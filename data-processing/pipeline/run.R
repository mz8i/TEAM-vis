library(dplyr, warn.conflicts = FALSE)
library(readr, warn.conflicts = FALSE)
library(testit)
library(jsonlite)
library(stringr)

options(dplyr.summarise.inform = FALSE)

source('src/utils.R')

IN_DATA_DIR <- Sys.getenv('TEAM_IN_DIR')
OUT_DATA_DIR <- Sys.getenv('TEAM_OUT_DIR')

source('src/emission_meta.R')
source('src/scenarios_meta.R')

source('src/prepare_dimensions.R')
prepare_dimensions(IN_DATA_DIR, OUT_DATA_DIR)


source('src/prepare_facts.R')
prepare_facts(IN_DATA_DIR, OUT_DATA_DIR)


prepare_scenarios_json(IN_DATA_DIR, OUT_DATA_DIR)