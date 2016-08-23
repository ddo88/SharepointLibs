/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Helpers.js" />
/// <reference path="Paradigma.Sharepoint.Utils.ts" />

namespace Paradigma {

    export class SharepointList {
        private url: string = "/_api/web/Lists";

        public getListById(id: string): SharepontListQuery {
            return new SharepontListQuery(this.url + "(guid'@')".replace('@', id));
        }

        public getListByName(name: string): SharepontListQuery {
            return new SharepontListQuery(this.url + "/GetByTitle('@')".replace('@', name));
        }
    }

    export class SharepontListQuery {

        private url: string = "";
        constructor(url: string) {
            this.url = url;
        }
        public getItems(): SharepointListFields {
            return new SharepointListFields(this.url + "/Items");
        }
        public getFields(): SharepointListFields {
            return new SharepointListFields(this.url + "/Fields");
        }
        public getContentTypes(): SharepointListFields {
            return new SharepointListFields(this.url + "/ContentTypes");
        }
        public getListItemEntityType():string
        {
            return new Paradigma.Utils().getSyncRequest(this.url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        }

        public insertListItem(item:any):any
        {
            debugger;
            //is IE
            if (detectBrowser().isIE) {
              UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = {
                "type": this.getListItemEntityType()
            };
            return new Paradigma.Utils().postRequest(this.url+ "/Items",item);
        }
    }
    
    export class SharepointListFields {

        private odata: string = "";
        private dictionaryOdata = [];
        private url: string = "";


        constructor(url: string) {
            this.url = url;
        }

        private IsValid(value): boolean {
            return value !== undefined &&
                   value !== null      &&
                    (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        }

        public FilterBy(filter: string, connector?:string): SharepointListFields {
            this.addProperty("$filter", filter,connector);
            return this;
        }
        public OrderBy(orderBy: string): SharepointListFields {
            this.addProperty("$orderBy", orderBy);
            return this;
        }
        public Select(fields: string): SharepointListFields {
            this.addProperty("$select", fields);
            return this;
        }
        public Top(top: string): SharepointListFields {
            this.addProperty("$top", top);
            return this;
        }
        public Expand(expand: string): SharepointListFields {
            this.addProperty("$expand", expand);
            return this;
        }

        private addProperty(key: string, value: string, connector?: string) {
            if (this.IsValid(value)){
                if (this.dictionaryOdata[key] === undefined) {
                    this.dictionaryOdata[key] = value;
                }
                else {
                    switch (key)
                    {
                        case '$filter':
                            if (connector !== undefined && (connector.toLowerCase() === "and" || connector.toLowerCase() === "or")) {
                                this.dictionaryOdata[key] += " @ ".replace('@', connector) + value;
                            }
                            else {
                                this.dictionaryOdata[key] += " and " + value;
                            }
                            break;
                        default: break;
                    }
                }
            }
        }
        private ProcessOdata(): void {
            var length = Object.keys(this.dictionaryOdata).length;
            if (length > 0) {
                var i = 0;
                for (var a in this.dictionaryOdata) {
                    if (i === 0) {
                        this.odata = "?@={value}".replace('@', a).replace('{value}', this.dictionaryOdata[a]);
                    }
                    else {
                        this.odata += "&@={value}".replace('@', a).replace('{value}', this.dictionaryOdata[a]);
                    }
                    i++;
                }
            }
        }
        public Exec(): any {
            this.ProcessOdata();
            return new Paradigma.Utils().getRequest(this.url + this.odata);
        }
    }    
}