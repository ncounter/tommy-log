# logorator
A log grinder to extract statistics and more

# What it does

1. A backend python log grinder to analyze, extract and compute information, generating JSON files with different content like:
  - a **distinct list  of URLs** with a **count visit** number taken from the log files. See [the algorithm](https://github.com/ncounter/logorator/blob/master/backend/count_urls.py) here
  - a **distinct list of URLs** with the **count visit** number taking the list from a given *URLs router map* file and counting the occurrencies of those URLs within the log files. See [the algorithm](https://github.com/ncounter/logorator/blob/master/backend/known_urls.py) here
  - a *from-to* pattern pair of urls starting from the log files, extracting relevant URLs grouped by the same user/ip, and counting the occurrencies of each *from-to* pattern. See [the algorithm](https://github.com/ncounter/logorator/blob/master/backend/elaborate_patterns.py) here

2. A web dashboard to view results from the backend analysis with some  filtering options



# How to use

## Get the source project
```
git clone git@github.com:ncounter/logorator.git
cd logorator
```


## Configuration
You may want to configure parameters in the `logorator.conf` file first.

```
...
tomcat_log_path=<TOMCAT_LOGS_PATH>
stats_file=./dashboard/public/stats.json
known_urls_output=./dashboard/public/known-urls.json
pattern_file=./dashboard/public/patterns.json
...
```
**Important**: changing location of files within this application, `stats_file` for instance, will make the **dashboard** web page unable to load data. Please make sure you will update the `json source file name` accordingly for each page.


## Backend: python analyzer

### Important
The `count_urls.py` program makes an assumption about your [log format](https://github.com/ncounter/logorator/blob/master/backend/utils.py#L14) expecting log lines with **the request** information containing the **url** wrapped between `""`, something like the following:

`192.168.1.101 - - [19/Oct/2017:11:00:16 +0200] "POST /my/url/path HTTP/1.1" 200 334`

The `known_urls.py` relies on the output of `count_urls.py` and on the output it generates itself from a given `.xml` map files with
```
  <action-mappings>
    <action path=""></action>
  </action-mappings>
```
element tags for the list of known routes.

The `elaborate_patterns.py` relies on more than one assumption instead:
- the `ip` address
- the `date and time` format
- the `url`


### Running

#### Everything in one shot
```
cd logorator
python backend/logorator.py
```

*Note: in case you miss to populate some `configuration parameter` values, the related elaboration will not be executed"


## Frontend: dashboard web page

Available pages:
- Raw Stats - *How many times your urls have been hitten?*
- Known route Stats - *Which known routes have been hit the most, and which never?*
- Refined Patterns - *Frequent patterns workflow*

* Functionalities - [[see here](https://github.com/ncounter/logorator#what-it-does)]

### Requirements

1. Nodejs
2. Yarn

### Running
```
cd logorator/dashboard
yarn install
yarn start
```
