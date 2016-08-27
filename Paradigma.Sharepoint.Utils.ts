/// <reference path="definitions/jquery.d.ts" />

namespace Paradigma
{
    export class Utils {

        public static AppendStringOnlyOnce(prefix:string,sufix:string):string{
            return prefix + ((prefix.indexOf(sufix)<0?sufix:""));
        }
        public static postRequest(url:string,data:any):any{
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

        public static getRequest(url): any {
            var settings: JQueryAjaxSettings = {
                url: url,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }
            return jQuery.ajax(settings);
        }

        public static getSyncRequest(url:string):any {
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