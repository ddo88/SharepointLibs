/// <reference path="definitions/jquery.d.ts" />
var Paradigma;
(function (Paradigma) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.validateReg = function (url, appendString, regex, fun, context) {
            if (url.match(regex)) {
                return fun(url + appendString);
            }
            return context;
        };
        /* search */
        Utils.checkKeys = function (value, keys) {
            var sw = false;
            for (var i = 0, length = keys.length; i < length; i++) {
                if (value.Key == keys[i])
                    sw = true;
            }
            return sw;
        };
        Utils.getCells = function (rows, keys) {
            var r = rows.filter(function (a, b, c) {
                return Paradigma.Utils.checkKeys(a, keys);
            });
            var obj = {};
            for (var i = 0, length = r.length; i < length; i++) {
                obj[r[i].Key] = r[i].Value;
            }
            return obj;
        };
        Utils.searchFormatData = function (data, keys) {
            if (typeof (keys) === "string") {
                keys = keys.split(',');
            }
            var result = [];
            // var totalRows = data.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
            var totalRows = data.d.query.PrimaryQueryResult.RelevantResults.RowCount;
            for (var i = 0, length = totalRows; i < totalRows; i++) {
                result.push(Paradigma.Utils.getCells(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results[i].Cells.results, keys));
            }
            return result;
        };
        /* end search */
        Utils.IsValid = function (value) {
            return value !== undefined &&
                value !== null &&
                (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        };
        Utils.GetValidUrl = function (url, prefix, value) {
            var validUrl = "";
            if (Paradigma.Utils.Contains(url, prefix)) {
                validUrl = value.replace(prefix, "");
            }
            else {
                validUrl = value;
            }
            return validUrl;
        };
        Utils.Contains = function (data, substring) {
            return (data.indexOf(substring) > -1);
        };
        Utils.AppendStringOnlyOnce = function (prefix, sufix) {
            return prefix + ((prefix.indexOf(sufix) < 0 ? sufix : ""));
        };
        Utils.updateRequest = function (url, data) {
            // if(data.__metadata!==undefined && data.__metadata.etag!==undefined)
            if (data.__metadata !== undefined) {
                var settings = {
                    url: url + "(@)".replace('@', data.Id),
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(data),
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "X-HTTP-Method": "MERGE",
                        "If-Match": "*"
                    }
                };
                return $.ajax(settings);
            }
            else {
                throw new Error("item not contain '__metadata.etag' property");
            }
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
        return Utils;
    }());
    Paradigma.Utils = Utils;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.Utils.js.map