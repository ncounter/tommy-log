#!/usr/bin/python

import numpy as np
import sys, os, re, ConfigParser, json
import utils

CONFIG_KEY_NAME = 'logorator'
CONFIG_FILE_PATH = './logorator.conf'

def main():
   # load and check all param from the config file
   sys.stdout.writelines(['loading config parameters from `', CONFIG_FILE_PATH, '`'])
   utils.print_separator()

   config = ConfigParser.ConfigParser()
   config.read(CONFIG_FILE_PATH)
   
   source_path = config.get(CONFIG_KEY_NAME, 'tomcat_log_path')
   stats_file_name = config.get(CONFIG_KEY_NAME, 'stats_file')

   # evaluate files with the following name pattern only
   regex = re.compile(r'localhost_access_log.(\d{4,}-\d{2,}-\d{2,}).txt')
   source_file_list = sorted(filter(regex.search, os.listdir(source_path)))

   sys.stdout.writelines(['analizyng ', str(len(source_file_list)), ' files'])
   utils.print_eol(2)

   # log files list to screen
   sys.stdout.writelines('\n'.join(source_file_list))
   utils.print_separator()

   # if output file exists, remove it and recreate it
   if os.path.exists(stats_file_name): os.remove(stats_file_name)
   stats_file = open(stats_file_name , 'w+')

   # create a map of { unique_url : occurrence_count }
   stats_map = {}
   distinct_url_set = set()
   duplicated_url_list = []

   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         for line in tuple(current_file):
            # extract the url from the log line
            current_url = utils.extract_url_from(line)

            # keep a distinct list as an index
            distinct_url_set.add(current_url)
            # add the url found into the urls bunch
            duplicated_url_list.append(current_url)

         current_file.close()

   for url in distinct_url_set:
      stats_map.update({url : duplicated_url_list.count(url)})

   sys.stdout.writelines([str(len(distinct_url_set)), ' distinct URLs found..'])
   utils.print_separator()

   # write statistics into JSON format { unique_url : occurrence_count }
   utils.write_line(stats_file, json.dumps(stats_map))

   stats_file.close()
   sys.stdout.writelines(['A new stats file has been generated in `', os.path.abspath(stats_file.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
