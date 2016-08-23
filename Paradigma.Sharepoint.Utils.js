/// <reference path="definitions/jquery.d.ts" />
var Paradigma;
(function (Paradigma) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.postRequest = function (url, data) {
            var settings = {
                url: url,
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(data),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            };
            return $.ajax(settings);
        };
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
        Utils.prototype.getSyncRequest = function (url) {
            var result;
            var settings = {
                url: url,
                type: "GET",
                async: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) { result = data; }
            };
            $.ajax(settings);
            return result;
        };
        ;
        return Utils;
    }());
    Paradigma.Utils = Utils;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.Utils.js.map