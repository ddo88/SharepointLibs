/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Helpers.js" />
/// <reference path="Paradigma.Sharepoint.Utils.ts" />

namespace Paradigma {

    

    export class OdataRest {

        private odata: string   = "";
        private dictionaryOdata = [];
        private url: string     = "";

        constructor(url: string) {
            this.url = url;
        }
        
        get Url():string{
            return this.url;
        }
        private IsValid(value): boolean {
            return value !== undefined &&
                   value !== null      &&
                    (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        }
        public filterBy(filter: string, connector?:string): OdataRest {
            this.addProperty("$filter", filter,connector);
            return this;
        }
        public orderBy(orderBy: string): OdataRest {
            this.addProperty("$orderBy", orderBy);
            return this;
        }
        public select(fields: string): OdataRest {
            this.addProperty("$select", fields);
            return this;
        }
        public top(top: string): OdataRest {
            this.addProperty("$top", top);
            return this;
        }
        public expand(expand: string): OdataRest {
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
        public exec(): any {
            this.ProcessOdata();
            return new Paradigma.Utils().getRequest(this.url + this.odata);
        }
        public execSync():any{
            this.ProcessOdata();
            return new Paradigma.Utils().getSyncRequest(this.url + this.odata);
        }
    }

    export class SharepointEndpoints
    {
        public static get list() : string {
            return "/_api/web/Lists";
        }
    }

    export class SharepointList extends OdataRest {

        constructor(site?:string) {
            super((site!==undefined?site:"")+SharepointEndpoints.list);
        }
        public getListById(id: string): SharepontListQuery {
            return new SharepontListQuery(this.Url + "(guid'@')".replace('@', id));
        }

        public getListByName(name: string): SharepontListQuery {
            return new SharepontListQuery(this.Url + "/GetByTitle('@')".replace('@', name));
        }
    }

    export class SharepontListQuery extends OdataRest {

        constructor(url: string) {
            super(url);
        }
        public getItems(): OdataRest {
            return new OdataRest(this.Url + "/Items");
        }
        public getItemById(id:number):SharepointListItemsMethods{
            return new SharepointListItemsMethods(this.Url+"/Items(@)".replace('@',id.toString()));
        }
        public getFields(): OdataRest {
            return new OdataRest(this.Url + "/Fields");
        }
        public getContentTypes(): OdataRest {
            return new OdataRest(this.Url + "/ContentTypes");
        }
        public getListItemEntityType():string
        {
            return new Paradigma.Utils().getSyncRequest(this.Url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        }
        
        public insertListItem(item:any):any
        {
            //if IE
            if (detectBrowser().isIE){
              UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = { "type": this.getListItemEntityType() };
            return new Paradigma.Utils().postRequest(this.Url+ "/Items",item);
        }
    }    

    export class SharepointListItemsMethods extends OdataRest{

        constructor(url:string){
            super(url);
        }
        public getFieldValuesAsHtml(){            
           return new OdataRest(this.Url+"/fieldValuesAsHtml");
        }
        public getFieldValuesAsText(){
           return new OdataRest(this.Url+"/fieldValuesAsText");
        }
        public getAttachmentFiles(){
            return new OdataRest(this.Url+"/AttachmentFiles")
        }
    }
    
    
}