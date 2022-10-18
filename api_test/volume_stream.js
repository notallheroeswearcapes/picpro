// Open a live stream of roughly 1% random sample of publicly available Tweets
// https://developer.twitter.com/en/docs/twitter-api/tweets/volume-streams/quick-start

const needle = require('needle');

const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
// const token = process.env.BEARER_TOKEN;
const token = 'AAAAAAAAAAAAAAAAAAAAAGwjhwEAAAAAFfa98soUqjauIXX%2BtzIxfABZIeE%3D8DiYMqJ10nIJk67khSYJ12UiOkzw3yea6scnXWMsGYOrvACk8s';

const streamURL = 'https://api.twitter.com/2/tweets/sample/stream';

function streamConnect(retryAttempt) {

  const stream = needle.get(streamURL, {
    headers: {
      "User-Agent": "v2SampleStreamJS",
      "Authorization": `Bearer ${token}`,
    },
    timeout: 20000
  });

  stream.on('data', data => {
    try {
      const json = JSON.parse(data);

      // console.log(lngDetector.detect(json.data.text, 5));

      // remove mentions from tweet
      var clean = json.data.text.replace(/ *\@[A-Za-z0-9_]+ */g, '')
      clean = clean.replace(/ *\#[A-Za-z0-9_]+ */g, '')

      // check language of tweet
      const eng = lngDetector.detect(clean, 1)

      // if language is english, print tweet
      if (eng[0].includes('english')) {
        console.log(json)
      }
      // A successful connection resets retry count.
      retryAttempt = 0;
    } catch (e) {
      // Catches error in case of 401 unauthorized error status.
      if (data.status === 401) {
        console.log(data);
        process.exit(1);
      } else if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
        console.log(data.detail)
        process.exit(1)
      } else {
        // Keep alive signal received. Do nothing.
      }
    }
  }).on('err', error => {
    if (error.code !== 'ECONNRESET') {
      console.log(error.code);
      process.exit(1);
    } else {
      // This reconnection logic will attempt to reconnect when a disconnection is detected.
      // To avoid rate limits, this logic implements exponential backoff, so the wait time
      // will increase if the client cannot reconnect to the stream.
      setTimeout(() => {
        console.warn("A connection error occurred. Reconnecting...")
        streamConnect(++retryAttempt);
      }, 2 ** retryAttempt);
    }
  });
  return stream;
}

(async () => {
  streamConnect(0)
})();