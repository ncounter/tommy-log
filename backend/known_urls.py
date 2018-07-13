#!/usr/bin/python

import numpy as np
import sys, os, re, json
from datetime import datetime
import utils
import xml.etree.ElementTree as ET

def main(known_urls_source_file_name, known_urls_prefix, known_urls_suffix, known_urls_output_name):
   if not utils.validate_param_list([known_urls_source_file_name, known_urls_prefix, known_urls_suffix, known_urls_output_name]):
      utils.print_eol(2)
      sys.stdout.writelines('known_urls.py cannot start, there is an error in received parameters')
      utils.print_eol(2)
      return

   sys.stdout.writelines('starting known_urls.py, please wait...')
   utils.print_eol(2)

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
   utils.print_eol(2)
