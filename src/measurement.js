//定数ファイルを計測用のJSと表示用のJSで共有とかできないので、各ファイルの先頭で定数定義する
const SITE_DOMAIN_KEY = "#site_url";
const DATA_KEY = "#data";
const key_name_suffix = "_times_msec";

function getKey(){
    let current_date = new Date();
    let yyyymmdd_str = current_date.getFullYear() + ("00" + (dt.getMonth()+1)).slice(-2) + ("00" + dt.getDate()).slice(-2);
    return yyyymmdd_str + key_name_suffix;
}

function initMeasurementData(data, host_name, key){
    if(!data[host_name]){
        data[host_name] = measurement_data;
    }

    if(!data[host_name][key]){
        data[host_name][key] = [];
    }
}

(function(){
    //登録サイト情報を引き出す
    chrome.storage.sync.get(SITE_DOMAIN_KEY, (value) => { var site_urls = value; });

    //訪れたサイトのURLが対象サイト内の場合、計測する
    let host_name = document.location.hostname;
    if(site_urls.indexOf(host_name) >= 0){

        /*
            `data` は以下のフォーマット
            {
                domain_name:{
                    yyyymmdd_times_sec: number[]
                }
            }
        */
        chrome.storage.sync.get(DATA_KEY, (value) => { var data = value; });

        let key = getKey();        
        initMeasurementData(data, host_name, key);
        data[host_name][key].push(Date.now * 1000);

        let save_data = {};
        save_data[DATA_KEY] = data;
        chrome.storage.sync.set(save_data);
    }
})();