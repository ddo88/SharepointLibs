/// <reference path="definitions/jquery.d.ts" />

namespace Paradigma
{

    export class Utils {

        public postRequest(url:string,data:any):any{
            var settings: JQueryAjaxSettings = {
                url:  url,
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(data),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }
            return $.ajax(settings);
        }

        public getRequest(url): any {
            var settings: JQueryAjaxSettings = {
                url: url,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }
            return jQuery.ajax(settings);
        }

        public getSyncRequest(url:string):any {
            var result;
            var settings: JQueryAjaxSettings = {
                url: url,
                type: "GET",
                async: false,
                headers: { "accept": "application/json;odata=verbose" },
                success: function (data) { result = data; }
            };
            $.ajax(settings);
            return result;
        };
    }
}