#!/usr/bin/python

import numpy as np
import sys, os, re, ConfigParser, json
from datetime import datetime
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
   pattern_file_name = config.get(CONFIG_KEY_NAME, 'pattern_file')

   # evaluate files with the following name pattern only
   regex = re.compile(r'localhost_access_log.(\d{4,}-\d{2,}-\d{2,}).txt')
   source_file_list = sorted(filter(regex.search, os.listdir(source_path)))

   sys.stdout.writelines(['analizyng ', str(len(source_file_list)), ' files'])
   utils.print_eol(2)

   # log files list to screen
   sys.stdout.writelines('\n'.join(source_file_list))
   utils.print_separator()

   # if output file exists, remove it and recreate it
   if os.path.exists(pattern_file_name): os.remove(pattern_file_name)
   pattern_file = open(pattern_file_name , 'w+')

   # create a map of shaped object like {ip : {url, datetime}}
   sequence_map = {}

   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         for line in tuple(current_file):
            # extract the values from the log line
            ip = utils.extract_ip_from(line)
            url = utils.extract_url_from(line)
            datetime = utils.extract_datetime_from(line)

            obj = {}
            obj['url'] = url
            obj['datetime'] = datetime.strftime('%Y-%m-%d %H:%M:%S')
            if ip in sequence_map.keys():
               existing_values = list()
               existing_values.extend(sequence_map[ip])
               existing_values.append(obj)
               sequence_map[ip] = existing_values
            else:
               sequence_map[ip] = [obj]

         current_file.close()

   # list of couple of patterns {from --> to : count}
   patterns = {}
   # sequence of patterns has to be created by the same ip because it is a user workflow
   for ip in sequence_map.keys():
      sequence_list = list()
      sequence_list.extend(sequence_map[ip])
      for i in range(len(sequence_list) - 1):
         current_item, next_item = sequence_list[i], sequence_list[i + 1]

         # prepare the key for the map
         key_item = current_item['url'] + ' --> ' + next_item['url']

         # now we can ignore the user (ip) and start counting
         # occurrencies of the same from-to pattern

         # increase the count if already added
         if key_item in patterns.keys():
            patterns[key_item] = patterns[key_item] + 1
         else:
            patterns[key_item] = 1

   # write statistics into JSON format
   utils.write_line(pattern_file, json.dumps(patterns))

   pattern_file.close()
   sys.stdout.writelines(['A new pattern file has been generated in `', os.path.abspath(pattern_file.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
