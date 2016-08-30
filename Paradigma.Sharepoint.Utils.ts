/// <reference path="definitions/jquery.d.ts" />

namespace Paradigma
{
    export class Utils {

        public static validateReg<T>(url:any,appendString:string,regex:RegExp,fun:(site:string)=>T,context:T):T
        {
            if(url.match(regex))
            {
                return fun(url+appendString);
            }
            return context;  
        }
                /* search */
        private static checkKeys(value:any, keys:any):boolean{
		    var sw = false;
		    for (var i = 0, length = keys.length; i < length; i++) {
    			if (value.Key == keys[i])
    				sw = true
    		}
    		return sw;
	    }

        private static getCells(rows:any, keys:any):any{
            var r = rows.filter(function (a, b, c) {
                    return Paradigma.Utils.checkKeys(a,keys);
                });
            var obj = {};
            for (var i = 0, length = r.length; i < length; i++) {
                obj[r[i].Key] = r[i].Value;
            }
            return obj;
	    }

        public static searchFormatData(data:any, keys:any):any{

            
            if (typeof(keys) === "string") {
                keys = keys.split(',');
            }
            var result = [];
            // var totalRows = data.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
            var totalRows = data.d.query.PrimaryQueryResult.RelevantResults.RowCount;
            for (var i = 0, length = totalRows; i < totalRows; i++) {
                result.push(Paradigma.Utils.getCells(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results[i].Cells.results, keys));
            }
            return result;
	    }

        /* end search */        

        
        public static IsValid(value:any): boolean {
            return value !== undefined &&
                   value !== null      &&
                    (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        }
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
        }
    }
}