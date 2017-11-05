import Vue from 'vue';

import { SCREEN_KEYS, STORAGE_KEYS } from "./constants/constants";
import { getTodayYYYYMMDDString } from "./utils/util";

function loadDataFromChromeStorage(key, callback) {
  chrome.storage.sync.get(key, callback);
}

function pageTitleFactory(key, content){
  return {
    key,
    content
  };
}

Vue.component('sidebar-item', {
  props: ['title', 'isActive'],
  template: 
    `<div v-bind:class="[isActive ? 'sidebar-item' : 'unselected-sidebar-item']"  @click="changeScreen">
      {{ title.content }}
     </div>`,
  methods: {
    changeScreen() {
      this.$emit('changescreen', this.title.key);
    }
  },
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

var app  = new Vue({
  el: "#app-root",
  data: {
    pageTitles: [
      pageTitleFactory(SCREEN_KEYS.viewData, "閲覧データ"),
      pageTitleFactory(SCREEN_KEYS.siteUrl, "計測対象サイト")
    ],
    currentScreenKey: SCREEN_KEYS.viewData,
    siteUrlInput: "",
    siteUrls: []
  },
  methods: {
    registerSiteUrl: function() {
      let text = this.$data.siteUrlInput;
      if(text.trim().length > 0){
        loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
          let urls = value[STORAGE_KEYS.siteUrl];
          if (!urls || !Array.isArray(urls)) {
            urls = [];
          }
          urls.push(text);
          chrome.storage.sync.set({ [STORAGE_KEYS.siteUrl]: urls });
  
          this.$data.siteUrls = urls;
          this.$data.siteUrlInput = "";
        });  
      }
    },
    deleteSiteUrl: function(hostName) {
      loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
        let urls = value[STORAGE_KEYS.siteUrl];
        urls = urls.filter( (siteUrl) => { return siteUrl !== hostName } );
        chrome.storage.sync.set({ [STORAGE_KEYS.siteUrl]: urls });

        this.$data.siteUrls = urls;
      });  
    }
  }
});

loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
  app.siteUrls = value[STORAGE_KEYS.siteUrl];
});
