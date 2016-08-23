
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