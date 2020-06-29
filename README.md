# device-detector-js-bundler-for-bigquery

We want to use device-detector-js in queries for BigQuery.

- device-detector: https://github.com/matomo-org/device-detector
- device-detector-js: https://github.com/etienne-martin/device-detector-js

---

## Build

```
$ npm install
$ npm run build
```

## Deploy

Put `.dist/device-detector-js_{version}.js` to your GCS bucket, then use it in queries for BigQuery.

## Use

Example:

```sql
CREATE TEMP FUNCTION parseUserAgent(userAgent STRING)
  RETURNS
    STRUCT<
      device STRUCT<
        brand STRING,
        model STRING,
        type STRING
      >,
      os STRUCT<
        name STRING,
        platform STRING,
        version STRING
      >,
      client STRUCT<
        engine STRING,
        engineVersion STRING,
        name STRING,
        type STRING,
        version STRING
      >,
      is_bot BOOLEAN
    >
  LANGUAGE js
  OPTIONS (
    library=["gs://{bucket_name}/path/to/device-detector-js_{version}.js"]
  )
  AS
"""
  var obj = deviceDetector.parse(userAgent);
  obj.is_bot = !!obj.bot;
  return obj;
""";

WITH
  table AS (
    SELECT "Mozilla/5.0 (Linux; Android 9; FIG-LA1 Build/HUAWEIFIG-LA1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36 YJApp-ANDROID jp.co.yahoo.android.yjtop/3.64.0" user_agent UNION ALL
    SELECT "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362" user_agent UNION ALL
    SELECT "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1" user_agent
  )

SELECT parseUserAgent(user_agent) ua, user_agent
FROM table
```
