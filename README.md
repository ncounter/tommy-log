# logorator
A log analyzer


## What it does
It analyzes Tomcat log files of your web app extracting **distinct URLs** and the **count visit** for each into a JSON `key:value` file format for `url:visit_count`

The generated output that will look like:
```
{
  "url_hit_stats":
  [{
    "/my/url/path/normally_viewed" : 194,
    "/my/url/path/frequently_viewed" : 3958,
    "/my/url/path/seldom_viewed" : 3,
    ...
  }]
}
```

## How to use

### Get the source project
```
git clone git@github.com:ncounter/logorator.git
cd logorator
```

### Configuration
You may want to configure parameters in the `logorator.conf` file first.

```
tomcat_log_path=<TOMCAT_LOGS_PATH>
stats_file=./dashboard/stats.json
```
Be aware that changing the `stats_file` parameter will make the **dashboard** web page unable to load data, please make sure you will update the [json source file](https://github.com/ncounter/logorator/blob/master/dashboard/dashboard.js) accordingly.

### Running
```
python url_stats.py
```

### Important
The `url_stats.py` program makes an assumption about your [log format](https://github.com/ncounter/logorator/blob/master/url_stats.py#L19) expecting log lines like the following

`xxx.xxx.xxx.xxx - - [19/Oct/2017:11:00:16 +0200] "POST /my/url/path HTTP/1.1" 200 334`
