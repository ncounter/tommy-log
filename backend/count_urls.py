#!/usr/bin/python

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

   # create a list of distinct counted URLs in a shaped object like [{ "url" : count }]
   stats_map = []

   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         for line in tuple(current_file):
            # extract the url from the log line
            current_url = utils.extract_url_from(line)

            # if added already, increase the counter
            if any(x for x in stats_map if current_url in x):
                existing_obj = next(x for x in stats_map if current_url in x)
                existing_obj[current_url] = existing_obj[current_url] + 1
            # else, add it with counter = 1
            else:
                url_obj = {}
                url_obj[current_url] = 1
                stats_map.append(url_obj)

         current_file.close()

   sys.stdout.writelines([str(len(stats_map)), ' distinct URLs found..'])
   utils.print_separator()

   # write statistics into JSON format { unique_url : occurrence_count }
   utils.write_line(stats_file, json.dumps(stats_map))

   stats_file.close()
   sys.stdout.writelines(['A new stats file has been generated in `', os.path.abspath(stats_file.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
