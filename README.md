# logorator
A log analyzer



# What it does
It analyzes Tomcat log files of your app extracting distinct URLs and the count visit for each into a JSON `key:value` file format like `url:visit_count`



# How to use

```
git clone git@github.com:ncounter/logorator.git
cd logorator
```

*IMPORTANT*: the `count_my_urls.py` program makes an assumption about your [log format](https://github.com/ncounter/logorator/blob/master/count_my_urls.py#L34) expecting lines like:

`xxx.xxx.xxx.xxx - - [19/Oct/2017:11:00:16 +0200] "POST /my/url/path HTTP/1.1" 200 334`


Running

`python count_my_urls.py --source_path=<TOMCAT_SOURCE_LOG_PATH> --stats_file=stats.json`

will generate a JSON format file that will look like:
```
{
  "url_hit_stats":
  [{
    "/my/url/path/frequently_viewed" : 3958,
    "/my/url/path/normally_viewed" : 194,
    "/my/url/path/seldom_viewed" : 3,
    ...
  }]
}
```
reporting the **URL PATH** and the **VISIT COUNT** for that URL.
