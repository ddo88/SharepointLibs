/// <reference path="definitions/jquery.d.ts" />
declare namespace Paradigma {
    class Utils {
        private static checkKeys(value, keys);
        private static getCells(rows, keys);
        static searchFormatData(data: any, keys: any): any;
        static IsValid(value: any): boolean;
        static AppendStringOnlyOnce(prefix: string, sufix: string): string;
        static postRequest(url: string, data: any): any;
        static getRequest(url: any): any;
        static getSyncRequest(url: string): any;
    }
}
