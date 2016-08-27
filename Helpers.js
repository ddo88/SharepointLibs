/*extrated from 
http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser?answertab=active#tab-top
by the user
http://stackoverflow.com/users/938089/rob-w
*/
function detectBrowser() {
    return {
        isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        isFirefox: typeof InstallTrigger !== 'undefined',
        isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        isIE: /*@cc_on!@*/false || !!document.documentMode,
        isEdge: !this.isIE && !!window.StyleMedia,
        isChrome: !!window.chrome && !!window.chrome.webstore,
        isBlink: (this.isChrome || this.isOpera) && !!window.CSS,
    }
}
