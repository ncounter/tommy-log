#!/usr/bin/python

import os
import re
from collections import OrderedDict
import numpy as np
import sys
import ConfigParser

CONFIG_KEY_NAME = 'logorator'
CONFIG_FILE_PATH = './logorator.conf'

def write_line(f, s):
   f.write(s + '\n')
   return f

# https://tomcat.apache.org/tomcat-7.0-doc/api/org/apache/catalina/valves/AccessLogValve.html
#
# logs pattern = %h %l %u %t "%r" %s %b
#
# %h - Remote host name (or IP address if enableLookups for the connector is false)
# %l - Remote logical username from identd (always returns '-')
# %u - Remote user that was authenticated
# %t - Date and time, in Common Log Format format
# %r - First line of the request
# %s - HTTP status code of the response   
# %b - Bytes sent, excluding HTTP headers, or '-' if no bytes were sent
#
# 127.0.0.1 - - [19/Oct/2017:11:00:16 +0200] "POST /rhn/rpc/api HTTP/1.1" 200 334
def manipulate_source_line(source_line):
    new_line = source_line

    # remove the %h %l and %u matched by '.*(?=\[)' = anything before '['
    # and remove the %t matched by '[\[].*[\]]' = anything between '[' and ']'
    # '.*(?=\[)' + '[\[].*[\]]' = '(.*(?=\]))' = anything before ']'
    new_line = re.sub('.*(?=\[)[\[].*[\]]', '', new_line)

    # save line request only, getting rid of %s and %b = keep everything between '"' '"'
    pattern = re.compile(r'["].*["]', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_line)
    if new_pattern_result != None :
        new_line = new_pattern_result.group(0)

    # getting rid of non-url slices
    new_line = re.sub('(?:("POST |"GET |"PUT | HTTP\/1.1"))', '', new_line)

    # getting rid of the querystring = everything after '?'
    new_line = re.sub('(\?).*', '', new_line)

    new_line = re.sub('\n', '', new_line)

    return '"' + new_line + '"'

def print_separator():
    sys.stdout.write('\n')
    sys.stdout.write('-------------------------------------------------------------')
    sys.stdout.write('\n')

def main():
   # load and check all param from the config file
   sys.stdout.writelines(['loading config parameters from `', CONFIG_FILE_PATH, '`'])
   print_separator()

   config = ConfigParser.ConfigParser()
   config.read(CONFIG_FILE_PATH)
   
   source_path = config.get(CONFIG_KEY_NAME, 'tomcat_log_path')
   stats_file_name = config.get(CONFIG_KEY_NAME, 'stats_file')

   # evaluate files with the following name pattern only
   regex = re.compile(r'localhost_access_log.(\d{4,}-\d{2,}-\d{2,}).txt')
   source_file_list = sorted(filter(regex.search, os.listdir(source_path)))

   print 'analizyng', len(source_file_list), 'files'
   print_separator()
   for i in range(0,len(source_file_list)):
       print str(i+1)+ '. ' + source_file_list[i]
   print_separator()
   if os.path.exists(stats_file_name): os.remove(stats_file_name)
   stats_file = open(stats_file_name , 'w+') #'stats.json'

   # create a map of { unique_url : occurrence_count }
   stats_map = {}
   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         for line in tuple(current_file):
            new_line = manipulate_source_line(line)
            # if not yet in the map, add it
            if new_line not in stats_map.keys():
                stats_map[new_line] = 1
            # else increase its counter
            else:
                stats_map[new_line] = stats_map[new_line] + 1
         current_file.close()

   # sort the map from the highest counter to the lowest
   stats_map = OrderedDict(reversed(sorted(stats_map.items(), key=lambda value: value[1])))
   print len(stats_map.keys()), 'distinct URLs found..'
   print_separator()

   # write statistics into JSON format { unique_url : occurrence_count }
   write_line(stats_file, '{"url_hit_stats":[{')
   for line_key in stats_map:
       write_line(stats_file, line_key + ' : ' + str(stats_map[line_key]) + ',')
   write_line(stats_file, '}]}')
   stats_file.close()
   print 'A new stats file has been generated in "', os.path.abspath(stats_file.name), '"'

if __name__ == "__main__":
    main()
