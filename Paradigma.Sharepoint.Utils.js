/// <reference path="definitions/jquery.d.ts" />
var Paradigma;
(function (Paradigma) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.getRequest = function (url) {
            var settings = {
                url: url,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            };
            return jQuery.ajax(settings);
        };
        return Utils;
    }());
    Paradigma.Utils = Utils;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.Utils.js.map