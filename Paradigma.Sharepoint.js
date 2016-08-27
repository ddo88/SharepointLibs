/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/SharePoint.d.ts" />
/// <reference path="Helpers.js" />
/// <reference path="Paradigma.Sharepoint.Utils.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Paradigma;
(function (Paradigma) {
    var SharepointList = (function () {
        function SharepointList(site) {
            this.url = "/_api/web/Lists";
            this.url = (site !== undefined ? site + this.url : this.url);
        }
        SharepointList.prototype.getListById = function (id) {
            return new SharepontListQuery(this.url + "(guid'@')".replace('@', id));
        };
        SharepointList.prototype.getListByName = function (name) {
            return new SharepontListQuery(this.url + "/GetByTitle('@')".replace('@', name));
        };
        return SharepointList;
    }());
    Paradigma.SharepointList = SharepointList;
    var SharepontListQuery = (function () {
        function SharepontListQuery(url) {
            this.url = "";
            this.url = url;
        }
        SharepontListQuery.prototype.getItems = function () {
            return new SharepointListFields(this.url + "/Items");
        };
        SharepontListQuery.prototype.getItemById = function (id) {
            return new SharepointListItemsMethods(this.url + "/Items(@)".replace('@', id.toString()));
        };
        SharepontListQuery.prototype.getFields = function () {
            return new SharepointListFields(this.url + "/Fields");
        };
        SharepontListQuery.prototype.getContentTypes = function () {
            return new SharepointListFields(this.url + "/ContentTypes");
        };
        SharepontListQuery.prototype.getListItemEntityType = function () {
            return new Paradigma.Utils().getSyncRequest(this.url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        };
        SharepontListQuery.prototype.insertListItem = function (item) {
            //if IE
            if (detectBrowser().isIE) {
                UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = { "type": this.getListItemEntityType() };
            return new Paradigma.Utils().postRequest(this.url + "/Items", item);
        };
        return SharepontListQuery;
    }());
    Paradigma.SharepontListQuery = SharepontListQuery;
    var SharepointListFields = (function () {
        function SharepointListFields(url) {
            this.odata = "";
            this.dictionaryOdata = [];
            this.url = "";
            this.url = url;
        }
        Object.defineProperty(SharepointListFields.prototype, "Url", {
            get: function () {
                return this.url;
            },
            enumerable: true,
            configurable: true
        });
        SharepointListFields.prototype.IsValid = function (value) {
            return value !== undefined &&
                value !== null &&
                (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        };
        SharepointListFields.prototype.FilterBy = function (filter, connector) {
            this.addProperty("$filter", filter, connector);
            return this;
        };
        SharepointListFields.prototype.OrderBy = function (orderBy) {
            this.addProperty("$orderBy", orderBy);
            return this;
        };
        SharepointListFields.prototype.Select = function (fields) {
            this.addProperty("$select", fields);
            return this;
        };
        SharepointListFields.prototype.Top = function (top) {
            this.addProperty("$top", top);
            return this;
        };
        SharepointListFields.prototype.Expand = function (expand) {
            this.addProperty("$expand", expand);
            return this;
        };
        SharepointListFields.prototype.addProperty = function (key, value, connector) {
            if (this.IsValid(value)) {
                if (this.dictionaryOdata[key] === undefined) {
                    this.dictionaryOdata[key] = value;
                }
                else {
                    switch (key) {
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
        };
        SharepointListFields.prototype.ProcessOdata = function () {
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
        };
        SharepointListFields.prototype.Exec = function () {
            this.ProcessOdata();
            return new Paradigma.Utils().getRequest(this.url + this.odata);
        };
        SharepointListFields.prototype.ExecSync = function () {
            this.ProcessOdata();
            return new Paradigma.Utils().getSyncRequest(this.url + this.odata);
        };
        return SharepointListFields;
    }());
    Paradigma.SharepointListFields = SharepointListFields;
    var SharepointListItemsMethods = (function (_super) {
        __extends(SharepointListItemsMethods, _super);
        function SharepointListItemsMethods(url) {
            _super.call(this, url);
        }
        SharepointListItemsMethods.prototype.getFieldValuesAsHtml = function () {
            return new SharepointListFields(this.Url + "/fieldValuesAsHtml");
        };
        SharepointListItemsMethods.prototype.getFieldValuesAsText = function () {
            return new SharepointListFields(this.Url + "/fieldValuesAsText");
        };
        SharepointListItemsMethods.prototype.getAttachmentFiles = function () {
            return new SharepointListFields(this.Url + "/AttachmentFiles");
        };
        return SharepointListItemsMethods;
    }(SharepointListFields));
    Paradigma.SharepointListItemsMethods = SharepointListItemsMethods;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.js.map