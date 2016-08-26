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

### SharepointListFields
- FilterBy - method to add odata filter to query
- OrderBy  - method to add odata orderBY field to query
- Select   - method to add odata select Fields to query
- Top      - method to add odata top limit to query
- Expand   - method to add odata Expand lookup properties to query

### Example of use:
```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.getItems()
.Top(2)
.Select("Id,Title,Url")
.Exec()
.done(function(d){console.log(d);});
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')/Items?$top=2&$select=Id"* and return jquery.ajax promise

another example:
```js
new SharepointList()
.getListByName("CustomList")
.getContentTypes()
.Exec()
.done(function (d) { console.log(d); });
```
this examples generate this request *"/_api/web/Lists/GetByTitle('CustomList')/ContentTypes"*

```js
new Paradigma.SharepointList()
.getListByName("CustomList")
.getItemById(1)
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

