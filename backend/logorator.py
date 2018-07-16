#!/usr/bin/python

import sys, os, ConfigParser
import utils
import count_urls, elaborate_patterns, known_urls

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
   count_urls.main(source_path, stats_file_name)

   pattern_file_name = config.get(CONFIG_KEY_NAME, 'pattern_file')
   pattern_url_known = config.get(CONFIG_KEY_NAME, 'pattern_url_known')
   elaborate_patterns.main(source_path, pattern_file_name, pattern_url_known)

   known_urls_source_file_name = config.get(CONFIG_KEY_NAME, 'known_urls_source')
   known_urls_prefix = config.get(CONFIG_KEY_NAME, 'known_urls_prefix')
   known_urls_suffix = config.get(CONFIG_KEY_NAME, 'known_urls_suffix')
   known_urls_output_name = config.get(CONFIG_KEY_NAME, 'known_urls_output')
   known_urls.main(known_urls_source_file_name, known_urls_prefix, known_urls_suffix, known_urls_output_name)

if __name__ == "__main__":
    main()
