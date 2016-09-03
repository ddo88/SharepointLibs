/// <reference path="definitions/jquery.d.ts" />
declare namespace Paradigma {
    class Utils {
        static validateReg<T>(url: any, appendString: string, regex: RegExp, fun: (site: string) => T, context: T): T;
        private static checkKeys(value, keys);
        private static getCells(rows, keys);
        static searchFormatData(data: any, keys: any): any;
        static IsValid(value: any): boolean;
        static GetValidUrl(url: string, prefix: string, value: string): string;
        static Contains(data: string, substring: string): boolean;
        static AppendStringOnlyOnce(prefix: string, sufix: string): string;
        static updateRequest(url: string, data: any): JQueryPromise<any>;
        static postRequest(url: string, data: any): any;
        static getRequest(url: any): any;
        static getSyncRequest(url: string): any;
    }
}
