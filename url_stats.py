#!/usr/bin/python

import numpy as np
import sys, os, re, ConfigParser, json

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

    # save line request only, getting rid of %h %l %u %t %s and %b
    # keep only the %r (everything between '"' '"')
    pattern = re.compile(r'["].*["]', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_line)
    if new_pattern_result != None :
        new_line = new_pattern_result.group(0)

    # save the url only
    pattern = re.compile(r'(\/.*) ', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_line)
    if new_pattern_result != None :
        new_line = new_pattern_result.group(0)

    # getting rid of the querystring = everything after '?'
    new_line = re.sub('(\?).*', '', new_line)
    new_line = re.sub('\n', '', new_line)

    return new_line.strip()

# print to standard output the EndOfLine character multiple times
def print_eol(time = 1):
    for t in range(0,time):
        sys.stdout.write('\n')

# print to standard output a nice line separator
def print_separator():
    print_eol()
    sys.stdout.write('---')
    print_eol()

def main():
   # load and check all param from the config file
   sys.stdout.writelines(['loading config parameters from `', CONFIG_FILE_PATH, '`'])
   print_separator()

   config = ConfigParser.ConfigParser()
   config.read(CONFIG_FILE_PATH)
   
   source_path = config.get(CONFIG_KEY_NAME, 'tomcat_log_path')
   stats_file_name = config.get(CONFIG_KEY_NAME, 'stats_file')
   pattern_file_name = config.get(CONFIG_KEY_NAME, 'pattern_file')

   # evaluate files with the following name pattern only
   regex = re.compile(r'localhost_access_log.(\d{4,}-\d{2,}-\d{2,}).txt')
   source_file_list = sorted(filter(regex.search, os.listdir(source_path)))

   sys.stdout.writelines(['analizyng ', str(len(source_file_list)), ' files'])
   print_eol(2)

   # log files list to screen
   sys.stdout.writelines('\n'.join(source_file_list))
   print_separator()

   # if output file exists, remove it and recreate it
   if os.path.exists(stats_file_name): os.remove(stats_file_name)
   stats_file = open(stats_file_name , 'w+')
   if os.path.exists(pattern_file_name): os.remove(pattern_file_name)
   pattern_file = open(pattern_file_name , 'w+')

   # create a map of { unique_url : occurrence_count }
   stats_map = {}
   pattern_map = {}
   distinct_url_set = set()
   duplicated_url_list = []

   for source_file_name in source_file_list:
      with open(source_path + source_file_name, 'r') as current_file:
         prev_url = None
         for line in tuple(current_file):
            # extract the url from the log line
            current_url = manipulate_source_line(line)
            # keep a distinct list as an index
            distinct_url_set.add(current_url)
            # add the url found into the urls bunch
            duplicated_url_list.append(current_url)

            # map the pattern flow {fromUrl:{toUrl:count}}
            if prev_url is not None:
                if prev_url in pattern_map:
                    to_url_map = pattern_map[prev_url]
                    if current_url in to_url_map:
                        to_url_map[current_url] = to_url_map[current_url] + 1
                    else:
                        to_url_map[current_url] = 1
                else:
                    pattern_map[prev_url] = {current_url:1}
            prev_url = current_url
         current_file.close()

   for url in distinct_url_set:
      stats_map.update({url : duplicated_url_list.count(url)})

   sys.stdout.writelines([str(len(distinct_url_set)), ' distinct URLs found..'])
   print_separator()

   # write statistics into JSON format { unique_url : occurrence_count }
   write_line(stats_file, json.dumps(stats_map))

   write_line(pattern_file, json.dumps(pattern_map))

   stats_file.close()
   sys.stdout.writelines(['A new stats file has been generated in `', os.path.abspath(stats_file.name), '`'])
   sys.stdout.write('\n')

   pattern_file.close()
   sys.stdout.writelines(['A new stats file has been generated in `', os.path.abspath(pattern_file.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
