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
    var OdataRest = (function () {
        function OdataRest(url) {
            this.odata = "";
            this.dictionaryOdata = [];
            this.url = "";
            this.url = url;
        }
        Object.defineProperty(OdataRest.prototype, "Url", {
            get: function () {
                return this.url;
            },
            enumerable: true,
            configurable: true
        });
        OdataRest.prototype.IsValid = function (value) {
            return value !== undefined &&
                value !== null &&
                (typeof (value) === "string" ? value.length > 0 : (typeof (value) === "number" ? parseInt(value) > 0 : false));
        };
        OdataRest.prototype.filterBy = function (filter, connector) {
            this.addProperty("$filter", filter, connector);
            return this;
        };
        OdataRest.prototype.orderBy = function (orderBy) {
            this.addProperty("$orderBy", orderBy);
            return this;
        };
        OdataRest.prototype.select = function (fields) {
            this.addProperty("$select", fields);
            return this;
        };
        OdataRest.prototype.top = function (top) {
            this.addProperty("$top", top);
            return this;
        };
        OdataRest.prototype.expand = function (expand) {
            this.addProperty("$expand", expand);
            return this;
        };
        OdataRest.prototype.addProperty = function (key, value, connector) {
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
        OdataRest.prototype.ProcessOdata = function () {
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
        OdataRest.prototype.exec = function () {
            this.ProcessOdata();
            return Paradigma.Utils.getRequest(this.url + this.odata);
        };
        OdataRest.prototype.execSync = function () {
            this.ProcessOdata();
            return Paradigma.Utils.getSyncRequest(this.url + this.odata);
        };
        return OdataRest;
    }());
    Paradigma.OdataRest = OdataRest;
    var SharepointEndpoints = (function () {
        function SharepointEndpoints() {
        }
        Object.defineProperty(SharepointEndpoints, "list", {
            get: function () {
                return "/_api/web/Lists";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "folders", {
            get: function () {
                return "/_api/web/Folders";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "userprofile", {
            get: function () {
                return "/_api/sp.userprofiles.peoplemanager";
            },
            enumerable: true,
            configurable: true
        });
        return SharepointEndpoints;
    }());
    Paradigma.SharepointEndpoints = SharepointEndpoints;
    var SharepointFolder = (function (_super) {
        __extends(SharepointFolder, _super);
        function SharepointFolder(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, SharepointEndpoints.folders));
        }
        SharepointFolder.prototype.getByName = function (name) {
            return new SharepointFolder(this.Url + "('@')".replace('@', name));
        };
        SharepointFolder.prototype.getFiles = function () {
            return new SharepointFile(this.Url);
        };
        return SharepointFolder;
    }(OdataRest));
    Paradigma.SharepointFolder = SharepointFolder;
    var SharepointFile = (function (_super) {
        __extends(SharepointFile, _super);
        function SharepointFile(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, '/Files'));
        }
        SharepointFile.prototype.getByName = function (name) {
            return new SharepointFile(this.Url + "('@')".replace('@', name));
        };
        SharepointFile.prototype.getListItemAllFields = function () {
            return new SharepointFile(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/ListItemAllFields"));
        };
        SharepointFile.prototype.getServerRelativeUrl = function () {
            return new SharepointFile(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/ServerRelativeUrl"));
        };
        return SharepointFile;
    }(OdataRest));
    Paradigma.SharepointFile = SharepointFile;
    var SharepointUserProfile = (function (_super) {
        __extends(SharepointUserProfile, _super);
        function SharepointUserProfile(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, SharepointEndpoints.userprofile));
        }
        SharepointUserProfile.prototype.getMyProperties = function () {
            return new OdataRest(this.Url + "/getmyproperties");
        };
        return SharepointUserProfile;
    }(OdataRest));
    Paradigma.SharepointUserProfile = SharepointUserProfile;
    var SharepointList = (function (_super) {
        __extends(SharepointList, _super);
        function SharepointList(site) {
            if (site === void 0) { site = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(site, SharepointEndpoints.list));
        }
        SharepointList.prototype.getListById = function (id) {
            return new SharepontListQuery(this.Url + "(guid'@')".replace('@', id));
        };
        SharepointList.prototype.getListByName = function (name) {
            return new SharepontListQuery(this.Url + "/GetByTitle('@')".replace('@', name));
        };
        return SharepointList;
    }(OdataRest));
    Paradigma.SharepointList = SharepointList;
    var SharepontListQuery = (function (_super) {
        __extends(SharepontListQuery, _super);
        function SharepontListQuery(url) {
            _super.call(this, url);
        }
        SharepontListQuery.prototype.getItems = function () {
            return new OdataRest(this.Url + "/Items");
        };
        SharepontListQuery.prototype.getItemById = function (id) {
            return new SharepointListItemsMethods(this.Url + "/Items(@)".replace('@', id.toString()));
        };
        SharepontListQuery.prototype.getFields = function () {
            return new OdataRest(this.Url + "/Fields");
        };
        SharepontListQuery.prototype.getContentTypes = function () {
            return new OdataRest(this.Url + "/ContentTypes");
        };
        SharepontListQuery.prototype.getListItemEntityType = function () {
            return new Paradigma.Utils().getSyncRequest(this.Url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        };
        SharepontListQuery.prototype.insertListItem = function (item) {
            //if IE
            if (detectBrowser().isIE) {
                UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = { "type": this.getListItemEntityType() };
            return new Paradigma.Utils().postRequest(this.Url + "/Items", item);
        };
        return SharepontListQuery;
    }(OdataRest));
    Paradigma.SharepontListQuery = SharepontListQuery;
    var SharepointListItemsMethods = (function (_super) {
        __extends(SharepointListItemsMethods, _super);
        function SharepointListItemsMethods(url) {
            _super.call(this, url);
        }
        SharepointListItemsMethods.prototype.getFieldValuesAsHtml = function () {
            return new OdataRest(this.Url + "/fieldValuesAsHtml");
        };
        SharepointListItemsMethods.prototype.getFieldValuesAsText = function () {
            return new OdataRest(this.Url + "/fieldValuesAsText");
        };
        SharepointListItemsMethods.prototype.getAttachmentFiles = function () {
            return new OdataRest(this.Url + "/AttachmentFiles");
        };
        return SharepointListItemsMethods;
    }(OdataRest));
    Paradigma.SharepointListItemsMethods = SharepointListItemsMethods;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.js.map