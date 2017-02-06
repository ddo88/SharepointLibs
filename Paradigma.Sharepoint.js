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
    var Demo2 = (function () {
        function Demo2() {
            this.name = "";
        }
        return Demo2;
    }());
    Paradigma.Demo2 = Demo2;
    var Request = (function () {
        function Request(url) {
            this.url = "";
            this.url = url;
        }
        Object.defineProperty(Request.prototype, "Url", {
            get: function () {
                return this.url;
            },
            set: function (v) {
                this.url = v;
            },
            enumerable: true,
            configurable: true
        });
        return Request;
    }());
    Paradigma.Request = Request;
    var OdataRest = (function (_super) {
        __extends(OdataRest, _super);
        function OdataRest(url) {
            _super.call(this, url);
            this.odata = "";
            this.dictionaryOdata = [];
        }
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
            if (Paradigma.Utils.IsValid(value)) {
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
            return Paradigma.Utils.getRequest(this.Url + this.odata);
        };
        OdataRest.prototype.execSync = function () {
            this.ProcessOdata();
            return Paradigma.Utils.getSyncRequest(this.Url + this.odata);
        };
        return OdataRest;
    }(Request));
    Paradigma.OdataRest = OdataRest;
    var SharepointEndpoints = (function () {
        function SharepointEndpoints() {
        }
        Object.defineProperty(SharepointEndpoints, "api", {
            get: function () {
                return "/_api/web";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "list", {
            get: function () {
                return this.api + "/Lists";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "folders", {
            get: function () {
                return this.api + "/Folders";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "getFolderByServerRelativeUrl", {
            get: function () {
                return this.api + "/getFolderByServerRelativeUrl";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharepointEndpoints, "getFileByServerRelativeUrl", {
            get: function () {
                return this.api + "/getFileByServerRelativeUrl";
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
        Object.defineProperty(SharepointEndpoints, "search", {
            get: function () {
                return "/_api/search";
            },
            enumerable: true,
            configurable: true
        });
        return SharepointEndpoints;
    }());
    var SharepointItem = (function (_super) {
        __extends(SharepointItem, _super);
        function SharepointItem(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, url);
        }
        SharepointItem.prototype.getProperties = function () {
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/Properties"));
        };
        SharepointItem.prototype.getServerRelativeUrl = function () {
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/ServerRelativeUrl"));
        };
        return SharepointItem;
    }(OdataRest));
    Paradigma.SharepointItem = SharepointItem;
    var SharepointFolderItem = (function (_super) {
        __extends(SharepointFolderItem, _super);
        function SharepointFolderItem(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, url);
        }
        SharepointFolderItem.prototype.getFiles = function () {
            return new SharepointFile(this.Url);
        };
        return SharepointFolderItem;
    }(SharepointItem));
    Paradigma.SharepointFolderItem = SharepointFolderItem;
    var SharepointFileRelativeUrl = (function (_super) {
        __extends(SharepointFileRelativeUrl, _super);
        function SharepointFileRelativeUrl(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, SharepointEndpoints.getFileByServerRelativeUrl));
        }
        SharepointFileRelativeUrl.prototype.getFile = function (relativeUrl) {
            return new SharepointFileItem(this.Url + "('@')".replace('@', relativeUrl));
        };
        return SharepointFileRelativeUrl;
    }(Request));
    Paradigma.SharepointFileRelativeUrl = SharepointFileRelativeUrl;
    var SharepointFolderRelativeUrlItem = (function (_super) {
        __extends(SharepointFolderRelativeUrlItem, _super);
        function SharepointFolderRelativeUrlItem(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, url);
        }
        SharepointFolderRelativeUrlItem.prototype.getFolders = function () {
            return new SharepointFolder(this.Url);
        };
        SharepointFolderRelativeUrlItem.prototype.getFiles = function () {
            return new SharepointFile(this.Url);
        };
        SharepointFolderRelativeUrlItem.prototype.getParentFolder = function () {
            return new SharepointFolderRelativeUrlItem(this.Url + "/ParentFolder");
        };
        SharepointFolderRelativeUrlItem.prototype.getListItemAllFields = function () {
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/ListItemAllFields"));
        };
        return SharepointFolderRelativeUrlItem;
    }(SharepointItem));
    Paradigma.SharepointFolderRelativeUrlItem = SharepointFolderRelativeUrlItem;
    var SharepointFolderRelativeUrl = (function (_super) {
        __extends(SharepointFolderRelativeUrl, _super);
        function SharepointFolderRelativeUrl(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, SharepointEndpoints.getFolderByServerRelativeUrl));
        }
        SharepointFolderRelativeUrl.prototype.getFolderByServerRelativeUrl = function (url) {
            return new SharepointFolderRelativeUrlItem(this.Url + "('@')".replace("@", url));
        };
        return SharepointFolderRelativeUrl;
    }(Request));
    Paradigma.SharepointFolderRelativeUrl = SharepointFolderRelativeUrl;
    var SharepointFolder = (function (_super) {
        __extends(SharepointFolder, _super);
        function SharepointFolder(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, Paradigma.Utils.GetValidUrl(url, SharepointEndpoints.api, SharepointEndpoints.folders)));
        }
        SharepointFolder.prototype.getByName = function (name) {
            return new SharepointFolderItem(this.Url + "('@')".replace('@', name));
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
        SharepointFile.prototype.getFileByName = function (name) {
            var append = "('@')".replace('@', name);
            return new SharepointFileItem(this.Url + append);
        };
        return SharepointFile;
    }(OdataRest));
    Paradigma.SharepointFile = SharepointFile;
    var SharepointFileItem = (function (_super) {
        __extends(SharepointFileItem, _super);
        function SharepointFileItem(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, url);
        }
        SharepointFileItem.prototype.getListItemAllFields = function () {
            return new OdataRest(Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/ListItemAllFields"));
        };
        return SharepointFileItem;
    }(SharepointItem));
    Paradigma.SharepointFileItem = SharepointFileItem;
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
            return Paradigma.Utils.getSyncRequest(this.Url + "?$select = ListItemEntityTypeFullName").d.ListItemEntityTypeFullName;
        };
        SharepontListQuery.prototype.insertListItem = function (item) {
            //if IE
            if (detectBrowser().isIE) {
                UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            }
            item["__metadata"] = { "type": this.getListItemEntityType() };
            return Paradigma.Utils.postRequest(this.Url + "/Items", item);
        };
        SharepontListQuery.prototype.updateListItem = function (item) {
            UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            if (item["__metadata"] === undefined) {
                item["__metadata"] = { "type": this.getListItemEntityType() };
            }
            return Paradigma.Utils.updateRequest(this.Url + "/Items", item);
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
    var SharepointSearch = (function (_super) {
        __extends(SharepointSearch, _super);
        function SharepointSearch(url) {
            if (url === void 0) { url = ""; }
            _super.call(this, Paradigma.Utils.AppendStringOnlyOnce(url, SharepointEndpoints.search));
        }
        Object.defineProperty(SharepointSearch.prototype, "properties", {
            get: function () {
                return this._properties;
            },
            set: function (v) {
                this._properties = v;
            },
            enumerable: true,
            configurable: true
        });
        SharepointSearch.prototype.query = function (query) {
            if (query === void 0) { query = ""; }
            this.Url = Paradigma.Utils.AppendStringOnlyOnce(this.Url, "/query?querytext='{@}'&clienttype='AllResultsQuery'".replace('{@}', query));
            return this;
        };
        SharepointSearch.prototype.select = function (fields) {
            if (fields === void 0) { fields = ""; }
            this.properties = fields;
            this.Url = Paradigma.Utils.AppendStringOnlyOnce(this.Url, "&selectproperties='{@}'".replace('{@}', fields));
            return this;
        };
        SharepointSearch.prototype.exec = function () {
            if (Paradigma.Utils.IsValid(this.properties)) {
                var promise = $.Deferred();
                var delegate = function (fields) {
                    return function (d) {
                        promise.resolve(Paradigma.Utils.searchFormatData(d, fields));
                    };
                };
                Paradigma.Utils.getRequest(this.Url).done(delegate(this.properties));
                return promise.promise();
            }
            return Paradigma.Utils.getRequest(this.Url);
        };
        return SharepointSearch;
    }(Request));
    Paradigma.SharepointSearch = SharepointSearch;
})(Paradigma || (Paradigma = {}));
//# sourceMappingURL=Paradigma.Sharepoint.js.map