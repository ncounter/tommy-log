# logorator
A log grinder to extract statistics and more

1. a backend python log grinder to analyze, extract and compute information
2. a web dashboard to view results from the backend analysis


# What it does
It analyzes Tomcat log files of your web app extracting **distinct URLs** and the **count visit** for each into a JSON `key:value` file format for `url:visit_count`

The generated output that will look like:
```
{
  "/my/url/path/normally_viewed" : 194,
  "/my/url/path/frequently_viewed" : 3958,
  "/my/url/path/seldom_viewed" : 3,
  ...
}
```
## WIP
Decode most frequent patterns of a typical workflow storing a pair of *from-to* url page.


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
```
Be aware that changing the `stats_file` parameter will make the **dashboard** web page unable to load data, please make sure you will update the [json source file](https://github.com/ncounter/logorator/blob/master/dashboard/dashboard.js) accordingly.


## Python analyzer

### Important
The `url_stats.py` program makes an assumption about your [log format](https://github.com/ncounter/logorator/blob/master/url_stats.py#L13) expecting log lines with **the request** information containing the **url** wrapped between `""`, something like the following for instance:

`192.168.1.101 - - [19/Oct/2017:11:00:16 +0200] "POST /my/url/path HTTP/1.1" 200 334`

### Running
```
cd logorator
python url_stats.py
less ./dashboard/public/stats.json
```

## Dashboard web page

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
