/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Helpers.js" />
/// <reference path="Paradigma.Sharepoint.Utils.ts" />

namespace Paradigma {
    export class Demo2{
        private name:string="";
    }
    export class Request{
        private url: string     = "";
        get Url():string{
            return this.url;
        }

        set Url(v : string) {
            this.url = v;
        }

        constructor(url: string) {
            this.url = url;
        }
    }

    export class OdataRest extends Request{

        private odata: string   = "";
        private dictionaryOdata = [];
        

        constructor(url: string) {
            super(url);
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
            if (Paradigma.Utils.IsValid(value)){
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
        public exec():  JQueryPromise<any> {
            this.ProcessOdata();
            return Paradigma.Utils.getRequest(this.Url + this.odata);
        }
        public execSync():any{
            this.ProcessOdata();
            return Paradigma.Utils.getSyncRequest(this.Url + this.odata);
        }
    }

    class SharepointEndpoints
    {
        public static get api():string{
            return "/_api/web";
        }
        public static get list() : string {
            return this.api+"/Lists";
        }

        public static get folders():string{
            return this.api+"/Folders";
        }

        public static get getFolderByServerRelativeUrl():string{
            return this.api+"/getFolderByServerRelativeUrl";
        }

        public static get getFileByServerRelativeUrl():string{
            return this.api+"/getFileByServerRelativeUrl";
        }

        public static get userprofile():string{
            return "/_api/sp.userprofiles.peoplemanager";
        }

        public static get search():string{
            return "/_api/search";  
        }
    }

    export class SharepointItem extends OdataRest{
        constructor(url:string="") {
            super(url);
        }

        public getProperties(){
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url,"/Properties"));
        }

        public getServerRelativeUrl(){
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url,"/ServerRelativeUrl"));
        }
    }

  export class SharepointFolderItem extends SharepointItem{
        constructor(url:string="") {
            super(url);
        }
        public getFiles(){
            return new SharepointFile(this.Url);
        }
    }

    export class SharepointFileRelativeUrl extends Request{
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,SharepointEndpoints.getFileByServerRelativeUrl));
        }

        public getFile(relativeUrl:string){
            return new SharepointFileItem(this.Url+"('@')".replace('@',relativeUrl));
        }
    }

    export class SharepointFolderRelativeUrlItem extends SharepointItem{
        constructor(url:string="") {
            super(url);
        }

        public getFolders(){
            return new SharepointFolder(this.Url);
        }

        public getFiles(){
            return new SharepointFile(this.Url);
        }

        public getParentFolder(){
            return new SharepointFolderRelativeUrlItem(this.Url+"/ParentFolder");
        }

        public getListItemAllFields(){
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url,"/ListItemAllFields")); 
        }
    }

    export class SharepointFolderRelativeUrl extends Request{
        
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,SharepointEndpoints.getFolderByServerRelativeUrl));
        }

        public getFolderByServerRelativeUrl(url:string):SharepointFolderRelativeUrlItem
        {
            return new SharepointFolderRelativeUrlItem(this.Url+"('@')".replace("@",url));
        }
    }

    
    
    export class SharepointFolder extends OdataRest{
        
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,Paradigma.Utils.GetValidUrl(url,SharepointEndpoints.api,SharepointEndpoints.folders)));
        }

        public getByName(name:string):SharepointFolderItem{
            return new SharepointFolderItem(this.Url+"('@')".replace('@',name));
        }       
    }

    export class SharepointFile extends OdataRest{
        
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,'/Files'));
        }

        public getFileByName(name:string){
            var append = "('@')".replace('@', name);
            return new SharepointFileItem(this.Url+append);
        }

    }
    export class SharepointFileItem extends SharepointItem {
          constructor(url:string="") {
            super(url);
        }

        public getListItemAllFields(){
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url,"/ListItemAllFields")); 
        }
    }

    export class SharepointUserProfile extends OdataRest
    {
        
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,SharepointEndpoints.userprofile));
        }
        public getMyProperties():OdataRest{
            return new OdataRest(this.Url + "/getmyproperties");
        }
    }


    export class SharepointList extends OdataRest {

        constructor(site:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(site,SharepointEndpoints.list));
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
            return Paradigma.Utils.getSyncRequest(this.Url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        }
        
        public insertListItem(item:any):any
        {
            //if IE
            if (detectBrowser().isIE){
              UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = { "type": this.getListItemEntityType() };
            return Paradigma.Utils.postRequest(this.Url+ "/Items",item);
        }

        public updateListItem(item:any):any{

            UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            if(item["__metadata"]===undefined){
                item["__metadata"] = { "type": this.getListItemEntityType() };
            }
            return Paradigma.Utils.updateRequest(this.Url+ "/Items",item);
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

    export class SharepointSearch extends Request{

        private _properties : string;
        get properties() : string {
            return this._properties;
        }
        set properties(v : string) {
            this._properties = v;
        }
        
        constructor(url:string="") {
            super(Paradigma.Utils.AppendStringOnlyOnce(url,SharepointEndpoints.search));
        }

        public query(query:string=""):SharepointSearch{
            this.Url=Paradigma.Utils.AppendStringOnlyOnce(this.Url,"/query?querytext='{@}'&clienttype='AllResultsQuery'".replace('{@}',query));
            return this
        }

        public select(fields:string=""):SharepointSearch{
            this.properties = fields;
            this.Url=Paradigma.Utils.AppendStringOnlyOnce(this.Url,"&selectproperties='{@}'".replace('{@}',fields));
            return this;
        }

        public exec(): JQueryPromise<any> {

            if(Paradigma.Utils.IsValid(this.properties))
            {
                var promise  = $.Deferred<any>();
                var delegate = function(fields){
                    return function(d){
                        promise.resolve(Paradigma.Utils.searchFormatData(d,fields));
                    }
                }
                Paradigma.Utils.getRequest(this.Url).done(delegate(this.properties));
                return promise.promise();
            }
            return Paradigma.Utils.getRequest(this.Url);
        }
    }
}