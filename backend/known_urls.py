#!/usr/bin/python

import numpy as np
import sys, os, re, ConfigParser, json
from datetime import datetime
import utils
import xml.etree.ElementTree as ET

CONFIG_KEY_NAME = 'logorator'
CONFIG_FILE_PATH = './logorator.conf'

def main():
   # load and check all param from the config file
   sys.stdout.writelines(['loading config parameters from `', CONFIG_FILE_PATH, '`'])
   utils.print_separator()

   config = ConfigParser.ConfigParser()
   config.read(CONFIG_FILE_PATH)
   
   known_urls_source_file_name = config.get(CONFIG_KEY_NAME, 'known_urls_source')
   known_urls_prefix = config.get(CONFIG_KEY_NAME, 'known_urls_prefix')
   known_urls_suffix = config.get(CONFIG_KEY_NAME, 'known_urls_suffix')
   known_urls_output_name = config.get(CONFIG_KEY_NAME, 'known_urls_output')
   
   # if output file exists, remove it and recreate it
   if os.path.exists(known_urls_output_name): os.remove(known_urls_output_name)
   known_urls_output = open(known_urls_output_name , 'w+')

   # create a list of string ["/url"]
   url_set = []
   if os.path.exists(known_urls_source_file_name):
      # log "file found" to screen
      sys.stdout.writelines('"' + known_urls_source_file_name + '" found, reading now...')
      utils.print_separator()

      tree = ET.parse(known_urls_source_file_name)
      root = tree.getroot()
      actions_map = root.findall('.//action-mappings/action')

      for action in actions_map:
         url_set.append(known_urls_prefix + action.attrib['path'] + known_urls_suffix)

   # write url list into JSON format
   utils.write_line(known_urls_output, json.dumps(url_set))

   known_urls_output.close()
   sys.stdout.writelines(['A new file has been generated in `', os.path.abspath(known_urls_output.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
