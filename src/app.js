import Vue from 'vue';

import { SCREEN_KEYS, STORAGE_KEYS } from "./constants/constants";
import { getTodayYYYYMMDDString } from "./utils/util";
import Timeline from "./utils/timeline";

function loadDataFromChromeStorage(key, callback) {
  chrome.storage.local.get(key, callback);
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

var timeline = new Timeline(Date.now());
var app  = new Vue({
  el: "#app-root",
  data: {
    pageTitles: [
      pageTitleFactory(SCREEN_KEYS.viewData, "閲覧データ"),
      pageTitleFactory(SCREEN_KEYS.siteUrl, "計測対象サイト")
    ],
    currentScreenKey: SCREEN_KEYS.viewData,
    siteUrlInput: "",
    siteUrls: [],
    viewDatas: []
  },
  //Chrome storageからの読み込みは非同期なので、updatedフックで実行する
  //暇があればviewDatas変更時のみにアップデートするようにする
  updated: function () {
    let key = getTodayYYYYMMDDString();
    
    for(let hostname in this.$data.viewDatas){
      let data = this.$data.viewDatas[hostname];
      let _data = [];
      if(data[key]){
        for(let d of data[key]){
          _data.push({
            timestamp: d.startTimeMsec,
            viewTime: d.endTimeMsec ? Math.floor((d.endTimeMsec - d.startTimeMsec)/1000) : 1
          })
        }
      }
      timeline.draw(hostname, _data);
    }
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
          chrome.storage.local.set({ [STORAGE_KEYS.siteUrl]: urls });
  
          this.$data.siteUrls = urls;
          this.$data.siteUrlInput = "";
        });  
      }
    },
    deleteSiteUrl: function(hostname) {
      loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
        let urls = value[STORAGE_KEYS.siteUrl];
        urls = urls.filter( (siteUrl) => { return siteUrl !== hostname } );
        chrome.storage.local.set({ [STORAGE_KEYS.siteUrl]: urls });

        this.$data.siteUrls = urls;
      });  
    }
  }
});

//非同期でChromeStorageから読み込み
loadDataFromChromeStorage(STORAGE_KEYS.siteUrl, value => {
  app.siteUrls = value[STORAGE_KEYS.siteUrl];
});
loadDataFromChromeStorage(STORAGE_KEYS.data, value => {
  app.viewDatas = value[STORAGE_KEYS.data];
});