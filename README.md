# logorator
A log grinder to extract statistics and more

1. a backend python log grinder to analyze, extract and compute information
2. a web dashboard to view results from the backend analysis



# What it does

## Hit URLs statistics
It analyzes Tomcat log files of your web app extracting **distinct URLs** and the **count visit** for each into a JSON `key:value` file format for `url:visit_count`

The generated output will look like:
```
[
  {"/my/url/path/normally_viewed" : 194},
  {"/my/url/path/frequently_viewed" : 3958},
  {"/my/url/path/seldom_viewed" : 3},
  ...
]
```


## Most frequent patterns from-to URLs
Decode most frequent patterns of a typical workflow generating object of a *from-to* pair of urls.

The generated output will look like:
```
[
  {
    "from" : "/my/url/path/from_page",
    "to" : "/my/url/path/to_page",
    "count": 125
  },
  {
    "from" : "/my/url/path/from_another_page",
    "to" : "/my/url/path/to_another_page",
    "count": 83
  },
  ...
]
```

# How to use

## Get the source project
```
git clone git@github.com:ncounter/logorator.git
cd logorator
```


## Configuration
You may want to configure parameters in the `logorator.conf` file first.

```
tomcat_log_path=<TOMCAT_LOGS_PATH>
stats_file=./dashboard/public/stats.json
pattern_file=./dashboard/public/patterns.json
```
Be aware that changing the `stats_file` parameter will make the **dashboard** web page unable to load data, please make sure you will update the [json source file for Stats](https://github.com/ncounter/logorator/tree/master/dashboard/src/Stats.js) and [json source file for Patterns](https://github.com/ncounter/logorator/tree/master/dashboard/src/Patterns.js) accordingly.


## Backend: python analyzer

### Important
The `count_urls.py` program makes an assumption about your [log format](https://github.com/ncounter/logorator/blob/master/count_urls.py#L13) expecting log lines with **the request** information containing the **url** wrapped between `""`, something like the following for instance:

`192.168.1.101 - - [19/Oct/2017:11:00:16 +0200] "POST /my/url/path HTTP/1.1" 200 334`

The `elaborate_patterns.py` relies on more than one assumption instead:
- the `ip` address
- the `date and time` format
- the `url`

### Running

#### Count URLs
```
cd logorator
python backend/count_urls.py
less ./dashboard/public/stats.json
```
#### Elaborate Patterns
```
cd logorator
python backend/elaborate_patterns.py
less ./dashboard/public/patterns.json
```


## Frontend: dashboard web page

Available pages:
- Stats
- Patterns [wip]

### Requirements

1. Nodejs
2. Yarn

### Running
```
cd logorator/dashboard
yarn install
yarn start
```
