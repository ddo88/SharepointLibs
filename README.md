# Paradigma.SharepointList

SharepointLib is designed to ease query sharepoint rest api on sharepoint

## OdataRest

this class allow odata methods for query 

- filterBy - method to add odata filter to query
- orderBy  - method to add odata orderBy field to query
- select   - method to add odata select Fields to query
- top      - method to add odata top limit to query
- expand   - method to add odata expand lookup properties to query

## Methods

### SharepointList

- getListById   - find list by guid
- getListByName - enable find list by Name

### SharepontListQuery
- getItems - find items in Sharepointlist
- getItemById - find Item by Id
- getFields - find fields in Sharepointlist
- getContentTypes - find ContenTypes on Sharepointlist
- getListItemEntityType - return ListItemEntityType e.g: "SP.Data.CustomListListItem"
- insertListItem - insert ListItem in list

### SharepointListItemMethods
- getFieldValuesAsHtml - return fields of selected listitem on html format, util for multiplelines fields 
- getFieldValuesAsText - return fields of seleted listitem on text format
- getAttachmentFiles - find attachment files in the selected listitem



### Example of use:
```js
    new Paradigma.SharepointList()
    .exec()
    .done(function(d){console.log(d);});
```
this examples generate this request *"/_api/web/Lists"* and return jquery.ajax promise

```js
    new Paradigma.SharepointList()
    .filterBy("Title eq 'CustomList'")
    .exec()
    .done(function(d){console.log(d);});
```
this examples generate this request *"/_api/web/Lists?$filter=Title eq 'CustomList'"* and return jquery.ajax promise

```js
    new Paradigma.SharepointList()
    .getListByName("CustomList")
    .exec()
    .done(function(d){console.log(d);});
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')"* and return jquery.ajax promise

```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.getItems()
.top(2)
.select("Id,Title,Url")
.exec()
.done(function(d){console.log(d);});
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')/Items?$top=2&$select=Id,Title,Url"* and return jquery.ajax promise

another example:
```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.getContentTypes()
.exec()
.done(function (d) { console.log(d); });
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')/ContentTypes"*

```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.getItemById(1)
.exec()
.done(function(d){console.log(d);})
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')/Items(1)"*

insert list item example:
```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.insertListItem({Title:"TestInsert",Url:"http://google.com"})
.done(function(d){console.log(d);})
```

### Sharepoint Folder
allow to user sharepoint rest api into folder of sharepoint

- getByName - find folder by name  
- getFiles - find file in folder

### SharepointFile

- getByName - find file in folder by name property
- getListItemAllFields - get all list item fields of file
- getServerRelativeUrl - get relative url from specific file

### Example of use:

get allfolders
```js
new Paradigma.SharepointFolder()
    .exec()
    .done(function(d){
        console.log(d);
        });
```

*"/_api/web/Folders"*

find folder by Name
```js
new Paradigma.SharepointFolder()
    .getByName('Banner')
    .exec()
    .done(function(d){console.log(d);});
```
*"/_api/web/Folders('Banner')"*

files in folder
```js
new Paradigma.SharepointFolder()
    .getByName('Banner')
    .getFiles()
    .exec()
    .done(function(d){console.log(d);});
```
*"/_api/web/Folders('Banner')/Files"*

filter files in folder
```js
new Paradigma.SharepointFolder()
    .getByName('Banner')
    .getFiles()
    .filterBy("Name eq 'banner_03.jpg'")
    .exec().done(function(d){console.log(d);});
```
*"/_api/web/Folders('Banner')/Files?$filter=Name eq 'banner_03.jpg'"*

get List item properties from file
```js
new Paradigma.SharepointFolder()
    .getByName('Banner')
    .getFiles()
    .getByName('arbol.png')
    .getListItemAllFields()
    .exec()
    .done(function(d){console.log(d);});
```
*"/_api/web/Folders('Banner')/Files('arbol.png')/ListItemAllFields"*

get file relative url from file
```js 
    new Paradigma.SharepointFolder()
    .getByName('Banner')
    .getFiles()
    .getByName('arbol.png')
    .getServerRelativeUrl()
    .exec()
    .done(function(d){console.log(d);});
```
*"/_api/web/Folders('Banner')/Files('arbol.png')/ServerRelativeUrl"*

### Sharepoint User profile

- getMyProperties - get all userprofile properties from current user;

```js
new Paradigma.SharepointUserProfile()
    .getMyProperties()
    .exec()
    .done(function(d){ console.log(d);});
```
*"/_api/sp.userprofiles.peoplemanager/getmyproperties"*

### Sharepoint Search

query - method to fill the query of search api - "queryText" 
select - allow select the propeties for return - "selectproperties". if this method is called the return is an object with selected properties 

```js
    new Paradigma.SharepointSearch().query('IsDocument:true').exec().done(function(d){console.log(d);})
```
![alt tag](https://github.com/ddo88/SharepointLibs/blob/master/images/return%20api%20search.png)


```js
    new Paradigma.SharepointSearch().query('IsDocument:true').select("Title,Path").exec().done(function(d){console.log(d);})
```
![alt tag](https://github.com/ddo88/SharepointLibs/blob/master/images/return%20properties.png)

### Paradigma Utils

contains helper methods for diferent uses

- ajax methods
- append strings



