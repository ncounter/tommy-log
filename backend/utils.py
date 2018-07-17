#!/usr/bin/python

import numpy as np
import sys, os, re, ConfigParser, json
from datetime import datetime

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
def extract_url_from(source_line):
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

# Extract the ip pattern from a log line
#
# 127.0.0.1 - - [19/Oct/2017:11:00:16 +0200] "POST /rhn/rpc/api HTTP/1.1" 200 334
def extract_ip_from(source_line):
    new_ip = source_line

    pattern = re.compile(r'([0-9]{1,3}\.){3}([0-9]{1,3})', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_ip)
    if new_pattern_result != None:
        new_ip = new_pattern_result.group(0)

    return new_ip


# Extract the datetime pattern from a log line
#
# 127.0.0.1 - - [19/Oct/2017:11:00:16 +0200] "POST /rhn/rpc/api HTTP/1.1" 200 334
def extract_datetime_from(source_line):
    new_datetime = source_line

    pattern = re.compile(r'[0123][0-9]/[A-Z][a-z]{2}/[0-9]{4}:[012][0-9]:[012345][0-9]:[012345][0-9]', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_datetime)
    if new_pattern_result != None:
        new_datetime = new_pattern_result.group(0)

    new_datetime = datetime.strptime(new_datetime, '%d/%b/%Y:%H:%M:%S')
    return new_datetime

def extract_method_from(source_line):
    new_method = source_line

    # save line request only, getting rid of %h %l %u %t %s and %b
    # keep only the %r (everything between '"' '"')
    pattern = re.compile(r'["].*["]', re.MULTILINE|re.IGNORECASE)
    new_pattern_result = pattern.search(new_method)
    if new_pattern_result != None :
        new_method = new_pattern_result.group(0)

    # extract the method from the request
    pattern = re.compile(r'(GET|POST|DELETE|PUT)', re.MULTILINE|re.IGNORECASE)
    new_method_result = pattern.search(new_method)
    if new_method_result != None:
        new_method = new_method_result.group(0)

    return new_method

# print to standard output the EndOfLine character multiple times
def print_eol(time = 1):
    for t in range(0,time):
        sys.stdout.write('\n')

# print to standard output a nice line separator
def print_separator():
    print_eol()
    sys.stdout.write('---')
    print_eol()

def validate_param_list(param_list):
    validation = True
    for i in range(len(param_list)):
        param = param_list[i]
        validation = not (param is None or param == '' or len(param) == 0)
        if not validation:
            break
    return validation

def get_log_row_object(source_line):
    obj = {}
    obj['url'] = extract_url_from(source_line)
    obj['ip'] = extract_ip_from(source_line)
    obj['method'] = extract_method_from(source_line)
    obj['date'] = extract_datetime_from(source_line).strftime('%Y-%m-%d %H:%M:%S')
    return obj