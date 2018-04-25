library(readr)
library(dplyr)

#Import and Load Data
national_meth <- read_csv("meth_seizures_90_17.csv")

#filter for CA
ca_meth <- national_meth %>%
  filter(State == "CA") %>%
  group_by(State)
  
#View structure of the data
glimpse(ca_meth)

#Sum for different years
ca_meth_year <- aggregate(ca_meth$`Nt Wt`, 
                          list(year = ca_meth$`Seize Year`), sum)

#write csv out
write_csv(ca_meth_year, "meth_seizure_ca.csv", na="")
