import { SESSION_LIMIT_MSEC, STORAGE_KEYS } from "./constants/constants";
import { getTodayYYYYMMDDString } from "./utils/util";

function viewDataFactory(startTimeMsec, endTimeMsec){
  return {
    startTimeMsec,
    endTimeMsec
  };
}

function updateMeasurementData(data, host_name, key) {
  if (!data[host_name]) {
    data[host_name] = {};
  }

  if (!data[host_name][key]) {
    data[host_name][key] = [viewDataFactory(undefined, undefined)];
  } else {
    data[host_name][key].push(viewDataFactory(undefined, undefined));
  }
}

function getDataTime(data, key){
  return data[data.length-1][key];
}

function setDataTime(data, key, time_msec){
  data[data.length-1][key] = time_msec;
}

(function() {
  chrome.storage.sync.get(STORAGE_KEYS.siteUrl, value => {
    let urls = value[STORAGE_KEYS.siteUrl];
    if (!urls || !Array.isArray(urls)) return;

    chrome.storage.sync.get(STORAGE_KEYS.data, value => {
      let data = value[STORAGE_KEYS.data] ? value[STORAGE_KEYS.data] : {};
      let hostname = document.location.hostname;
      let key = getTodayYYYYMMDDString();
      
      chrome.storage.sync.get(STORAGE_KEYS.lastVisitedHost, value => {
        let lastVisitedHost = value[STORAGE_KEYS.lastVisitedHost];

        if(!lastVisitedHost && lastVisitedHost === hostname){

          // 前回のアクセスと同一ドメインの場合はセッション切れをしていないか確認をする
          let currentTimeMsec = Date.now();
          if(currentTimeMsec - data[hostname][key].startTimeMsec > SESSION_LIMIT_MSEC){
            setDataTime(data[hostname][key], "endTimeMsec", data[hostname][key].startTimeMsec + SESSION_LIMIT_MSEC);
            data[hostname][key].push(viewDataFactory(currentTimeMsec, undefined));
          }
        } else if(urls.indexOf(hostname) >= 0){

          // 計測対象サイト内の場合はタイムスタンプを登録
          updateMeasurementData(data, hostname, key);
          setDataTime(data[hostname][key], "startTimeMsec", Date.now());
        } else if(data[lastVisitedHost] && data[lastVisitedHost][key]){

          // 訪問終了時刻の確定を行う
          if(!getDataTime(data[lastVisitedHost][key], "endTimeMsec")){
            setDataTime(data[lastVisitedHost][key], "endTimeMsec", Date.now());
          }
        }

        chrome.storage.sync.set({ [STORAGE_KEYS.lastVisitedHost]: hostname });
        chrome.storage.sync.set({ [STORAGE_KEYS.data]: data });
        
      });
    });
  });
})()