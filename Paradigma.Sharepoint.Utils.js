/// <reference path="definitions/jquery.d.ts" />
var Paradigma;
(function (Paradigma) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.IsValid = function (value) {
            return value !== undefined &&
                value !== null &&
                (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        };
        Utils.AppendStringOnlyOnce = function (prefix, sufix) {
            return prefix + ((prefix.indexOf(sufix) < 0 ? sufix : ""));
        };
        Utils.postRequest = function (url, data) {
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
        Utils.getRequest = function (url) {
            var settings = {
                url: url,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            };
            return jQuery.ajax(settings);
        };
        Utils.getSyncRequest = function (url) {
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