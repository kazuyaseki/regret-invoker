//定数ファイルを計測用のJSと表示用のJSで共有とかできないので、各ファイルの先頭で定数定義する
const SITE_DOMAIN_KEY = "#site_url";
const DATA_KEY = "#data";
const keyNameSuffix = "_times_msec";

function loadSiteUrls(callback) {
    chrome.storage.sync.get(SITE_DOMAIN_KEY, callback );
}

var siteUrls = new Vue({
    el: '#site-urls',
    data: {
        siteUrls: []
    },
    methods: {
        addSiteUrl: function ( value ) {
            this.$data.siteUrls.push(value);
        }
    }
})
loadSiteUrls( ( value ) => { siteUrls.siteUrls = value; } );

var siteUrlRegister = new Vue({
    el: '#site-url-register',
    data: {
        siteUrlText: ""
    },
    methods: {
        registerSiteUrl: function () {
            let text =  this.$data.siteUrlText;
            loadSiteUrls( ( value ) => { 
                let urls = value[SITE_DOMAIN_KEY];
                if(!urls || !Array.isArray(urls)){
                    urls = [];
                }
                urls.push(text);

                let saveData = {}
                saveData[SITE_DOMAIN_KEY] = urls;
                chrome.storage.sync.set(saveData);

                siteUrls.siteUrls = urls;
                this.$data.siteUrlText = "";                
            } );
        }
    }
})
/*
var componentRoot = new Vue({
    template: '<div>hello!</div>',
    components: {
    }
});

// 要素にマウントする
componentRoot.$mount( '#vue-root' );*/