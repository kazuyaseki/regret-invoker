//定数ファイルを計測用のJSと表示用のJSで共有とかできないので、各ファイルの先頭で定数定義する
const SITE_DOMAIN_KEY = "#site_url";
const DATA_KEY = "#data";
const keyNameSuffix = "_times_msec";

var initialSiteUrls;
chrome.storage.sync.get(SITE_DOMAIN_KEY, (value) => { initialSiteUrls = value; console.log(initialSiteUrls);})
var example1 = new Vue({
    el: '#site-urls',
    data: {
        siteUrls: initialSiteUrls
    },
    methods: {
        addSiteUrl: function ( value ) {
            this.$data.siteUrls.push(value);
        }
    }
})

var componentRoot = new Vue({
    template: '<div>hello!</div>',
    components: {
    }
});

// 要素にマウントする
componentRoot.$mount( '#vue-root' );