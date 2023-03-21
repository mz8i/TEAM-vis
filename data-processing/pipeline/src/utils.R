`%//%` <- function(x,y) {
  #' Operator for file path concatenation (based on file.path)
  #' Like Python pathlib's / operator
  #' Cannot use %/% because that's built-in integer division
  #' 
  #' Example usage:
  #' some/directories' %//% 'filename.csv'
  #' 
  #' Results in:
  #' 'some/directories/filename.csv'
  file.path(x, y)
}

`%.%` <- function(x,y) {
  #' String concatenation operator (based on paste0)
  paste0(x,y)
}

symdiff <- function( x, y) setdiff( union(x, y), intersect(x, y))

sanitizeSlug <- function(unsafeChar) {
  #' Sanitize a string so that it can be used in filenames and query params
  #' This is not exhaustive, it manually covers the cases encountered in the data
  #' Any further problematic characters should be added to the below mapping
  
  mapping <- c(
    `>`= 'gt',
    `<` = 'lt'
    # add more here
  )
  
  dplyr::recode(unsafeChar, !!!mapping)
}