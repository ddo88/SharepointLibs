/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Paradigma.Sharepoint.Utils.d.ts" />
declare namespace Paradigma {
    class OdataRest {
        private odata;
        private dictionaryOdata;
        private url;
        constructor(url: string);
        Url: string;
        filterBy(filter: string, connector?: string): OdataRest;
        orderBy(orderBy: string): OdataRest;
        select(fields: string): OdataRest;
        top(top: string): OdataRest;
        expand(expand: string): OdataRest;
        private addProperty(key, value, connector?);
        private ProcessOdata();
        exec(): JQueryPromise<any>;
        execSync(): any;
    }
    class SharepointFolder extends OdataRest {
        constructor(url?: string);
        getByName(name: string): SharepointFolder;
        getFiles(): SharepointFile;
    }
    class SharepointFile extends OdataRest {
        constructor(url?: string);
        getFileByName(name: string): SharepointFile;
        getListItemAllFields(): SharepointFile;
        getServerRelativeUrl(): SharepointFile;
    }
    class SharepointUserProfile extends OdataRest {
        constructor(url?: string);
        getMyProperties(): OdataRest;
    }
    class SharepointList extends OdataRest {
        constructor(site?: string);
        getListById(id: string): SharepontListQuery;
        getListByName(name: string): SharepontListQuery;
    }
    class SharepontListQuery extends OdataRest {
        constructor(url: string);
        getItems(): OdataRest;
        getItemById(id: number): SharepointListItemsMethods;
        getFields(): OdataRest;
        getContentTypes(): OdataRest;
        getListItemEntityType(): string;
        insertListItem(item: any): any;
    }
    class SharepointListItemsMethods extends OdataRest {
        constructor(url: string);
        getFieldValuesAsHtml(): OdataRest;
        getFieldValuesAsText(): OdataRest;
        getAttachmentFiles(): OdataRest;
    }
    class SharepointSearch {
        private _url;
        Url: string;
        private _properties;
        properties: string;
        constructor(url?: string);
        query(query?: string): SharepointSearch;
        select(fields?: string): SharepointSearch;
        exec(): JQueryPromise<any>;
    }
}
