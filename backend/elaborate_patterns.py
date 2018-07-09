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

   # create a map of { unique_url : occurrence_count }
   pattern_map = {}

   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         prev_url = None
         prev_ip = None
         for line in tuple(current_file):
            # extract the url from the log line
            current_ip = utils.extract_ip_from_string(line)
            current_url = utils.manipulate_source_line(line)

            # map the pattern flow {ip:{fromUrl:{toUrl:count}}}
            if current_ip is not None:
                if current_ip in pattern_map:
                    ip_map = pattern_map[current_ip]
                    if prev_url is not None:
                        if prev_url in ip_map:
                            to_url_map = ip_map[prev_url]
                            if current_url in to_url_map:
                                to_url_map[current_url] = to_url_map[current_url] + 1
                            else:
                                to_url_map[current_url] = 1
                        else:
                            ip_map[prev_url] = {current_url:1}
                else:
                    pattern_map[current_ip] = {current_url:{}}

            prev_url = current_url

         current_file.close()

   # write statistics into JSON format {ip:{fromUrl:{toUrl:count}}}
   utils.write_line(pattern_file, json.dumps(pattern_map))

   pattern_file.close()
   sys.stdout.writelines(['A new pattern file has been generated in `', os.path.abspath(pattern_file.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
