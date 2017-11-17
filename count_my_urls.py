#!/usr/bin/python

import os
import re
from collections import OrderedDict
import numpy as np
import sys

def write_line(f, s):
   f.write(s + '\n')
   return f

def decode_args(args_list):
    args_map = {}
    for element in args_list:
       slices = re.split('=', element)
       if len(slices) > 1:
          args_map[slices[0]] = slices[1]
    return args_map

# https://tomcat.apache.org/tomcat-7.0-doc/api/org/apache/catalina/valves/AccessLogValve.html
#
# logs pattern="%h %l %u %t &quot;%r&quot; %s %b"
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
    new_line = re.sub('(?:("POST |"GET | HTTP\/1.1"))', '', new_line)

    # getting rid of the querystring = everything after '?'
    new_line = re.sub('(\?).*', '', new_line)

    new_line = re.sub('\n', '', new_line)

    return '"' + new_line + '"'

# required params: --source_path , --stats_file
def main():
   # return a map of arguments { key_name : value }
   arguments = decode_args(sys.argv)
   
   #
   # TODO
   #
   # test if required args are there
   #

   source_path = arguments['--source_path'] #'./tomcat_logs_source/'
   
   source_file_list = sorted(os.listdir(source_path))
   statistics_file = open(arguments['--stats_file'] , 'w+') #'statistics.json'
   new_lines = []
   count = 0
   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         for line in tuple(current_file):
            new_lines.append(manipulate_source_line(line))
            count = count + 1
         current_file.close()
   
   # sort and get a list from a numpy array
   new_lines_sorted = list(np.array(new_lines))
   
   # get unique lines
   unique_lines_index = list(OrderedDict.fromkeys(new_lines_sorted))

   # create a map of { occurrency_count : unique_url }
   statistics_map = {}
   for new_unique_line in unique_lines_index:
      statistics_map[new_lines_sorted.count(new_unique_line)] = new_unique_line

   # write statistics into JSON format { unique_url : occurrency_count }
   write_line(statistics_file, '{"url_hit_stats":[{')
   for line_key in reversed(sorted(statistics_map)):
       write_line(statistics_file, statistics_map[line_key] + ' : ' + str(line_key) + ',')
   write_line(statistics_file, '}]}')
   statistics_file.close()

if __name__ == "__main__":
    main()
