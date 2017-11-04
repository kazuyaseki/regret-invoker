import { STORAGE_KEYS, KEY_NAME_SUFFIX } from "./constants/constants";

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
loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
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
      loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
        let urls = value[STORAGE_KEYS.siteUrl];
        if (!urls || !Array.isArray(urls)) {
          urls = [];
        }
        urls.push(text);

        let saveData = {};
        saveData[STORAGE_KEYS.siteUrl] = urls;
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
loadDataFromChromeStorage(STORAGE_KEYS.data, value => {
  viewCountList.viewDatas = value[STORAGE_KEYS.data];
});
