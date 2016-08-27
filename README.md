# Paradigma.SharepointList

SharepointLib is designed to ease query sharepoint rest api on sharepoint list

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

### OdataRest
- filterBy - method to add odata filter to query
- orderBy  - method to add odata orderBy field to query
- select   - method to add odata select Fields to query
- top      - method to add odata top limit to query
- expand   - method to add odata expand lookup properties to query

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
new SharepointList()
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

