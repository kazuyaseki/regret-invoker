//定数ファイルを計測用のJSと表示用のJSで共有とかできないので、各ファイルの先頭で定数定義する
const SITE_DOMAIN_KEY = "#site_url";
const DATA_KEY = "#data";
const keyNameSuffix = "_times_msec";

function loadDataFromChromeStorage(key, callback) {
  chrome.storage.sync.get(key, callback);
}

function getTodayYYYYMMDDString() {
  let current_date = new Date();
  return (
    current_date.getFullYear() +
    ("00" + (current_date.getMonth() + 1)).slice(-2) +
    ("00" + current_date.getDate()).slice(-2)
  );
}

var siteUrls = new Vue({
  el: "#site-urls",
  data: {
    siteUrls: []
  },
  methods: {
    addSiteUrl: function(value) {
      this.$data.siteUrls.push(value);
    }
  }
});
loadDataFromChromeStorage(SITE_DOMAIN_KEY, value => {
  siteUrls.siteUrls = value;
});

var siteUrlRegister = new Vue({
  el: "#site-url-register",
  data: {
    siteUrlText: ""
  },
  methods: {
    registerSiteUrl: function() {
      let text = this.$data.siteUrlText;
      loadDataFromChromeStorage(SITE_DOMAIN_KEY, value => {
        let urls = value[SITE_DOMAIN_KEY];
        if (!urls || !Array.isArray(urls)) {
          urls = [];
        }
        urls.push(text);

        let saveData = {};
        saveData[SITE_DOMAIN_KEY] = urls;
        chrome.storage.sync.set(saveData);

        siteUrls.siteUrls = urls;
        this.$data.siteUrlText = "";
      });
    }
  }
});

var viewCountList = new Vue({
  el: "#view-counts",
  data: {
    viewDatas: []
  },
  methods: {
    renderCounts: function(viewData) {
      let today_date = getTodayYYYYMMDDString();
      for (let date in viewData) {
        if (date.indexOf(today_date) >= 0) {
          return viewData[date].length;
        }
      }
    },
    renderViewTimes: function(viewData) {
      //TODO: こういう処理の共有みたいなののスマートな方法ないか調べる。
      let today_date = getTodayYYYYMMDDString();
      for (let date in viewData) {
        if (date.indexOf(today_date) >= 0) {
          let times = [];
          for (let time of viewData[date]) {
            times.push(new Date(time / 1000).toLocaleString());
          }

          return times;
        }
      }
    }
  }
});
loadDataFromChromeStorage(DATA_KEY, value => {
  viewCountList.viewDatas = value[DATA_KEY];
});
