/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Paradigma.Sharepoint.Utils.d.ts" />
declare namespace Paradigma {
    class Request {
        private url;
        Url: string;
        constructor(url: string);
    }
    class OdataRest extends Request {
        private odata;
        private dictionaryOdata;
        constructor(url: string);
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
    class SharepointItem extends OdataRest {
        constructor(url?: string);
        getProperties(): OdataRest;
        getServerRelativeUrl(): OdataRest;
    }
    class SharepointFolderItem extends SharepointItem {
        constructor(url?: string);
        getFiles(): SharepointFile;
    }
    class SharepointFolderRelativeUrlItem extends SharepointItem {
        constructor(url?: string);
        getFolders(): SharepointFolder;
        getFiles(): SharepointFile;
        getListItemAllFields(): OdataRest;
    }
    class SharepointFolderRelativeUrl extends Request {
        constructor(url?: string);
        getFolderByServerRelativeUrl(url: string): SharepointFolderRelativeUrlItem;
    }
    class SharepointFolder extends OdataRest {
        constructor(url?: string);
        getByName(name: string): SharepointFolderItem;
    }
    class SharepointFile extends OdataRest {
        constructor(url?: string);
        getFileByName(name: string): SharepointFileItem;
    }
    class SharepointFileItem extends SharepointItem {
        constructor(url?: string);
        getListItemAllFields(): OdataRest;
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
        updateListItem(item: any): any;
    }
    class SharepointListItemsMethods extends OdataRest {
        constructor(url: string);
        getFieldValuesAsHtml(): OdataRest;
        getFieldValuesAsText(): OdataRest;
        getAttachmentFiles(): OdataRest;
    }
    class SharepointSearch extends Request {
        private _properties;
        properties: string;
        constructor(url?: string);
        query(query?: string): SharepointSearch;
        select(fields?: string): SharepointSearch;
        exec(): JQueryPromise<any>;
    }
}
