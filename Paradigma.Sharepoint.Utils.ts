/// <reference path="definitions/jquery.d.ts" />

namespace Paradigma
{

    export class Utils {

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
    }
}