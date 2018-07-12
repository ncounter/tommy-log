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
   
   struts_file_name = config.get(CONFIG_KEY_NAME, 'struts_file')
   struts_url_prefix = config.get(CONFIG_KEY_NAME, 'struts_url_prefix')
   struts_url_suffix = config.get(CONFIG_KEY_NAME, 'struts_url_suffix')
   struts_output_name = config.get(CONFIG_KEY_NAME, 'struts_output')
   
   # if output file exists, remove it and recreate it
   if os.path.exists(struts_output_name): os.remove(struts_output_name)
   struts_output = open(struts_output_name , 'w+')

   # create a list of shaped object like [{ url: "/url" }]
   url_set = []
   if os.path.exists(struts_file_name):
      # log "file found" to screen
      sys.stdout.writelines('"' + struts_file_name + '" found, reading now...')
      utils.print_separator()

      tree = ET.parse(struts_file_name)
      root = tree.getroot()
      actions_map = root.findall('.//action-mappings/action')

      for action in actions_map:
         new_obj = {}
         new_obj['url'] = struts_url_prefix + action.attrib['path'] + struts_url_suffix
         url_set.append(new_obj)

   # write url list into JSON format
   utils.write_line(struts_output, json.dumps(url_set))

   struts_output.close()
   sys.stdout.writelines(['A new file has been generated in `', os.path.abspath(struts_output.name), '`'])
   sys.stdout.write('\n')

if __name__ == "__main__":
    main()
