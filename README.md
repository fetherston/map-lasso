# Map Lasso, a Lasso Tool for Google Maps

## Demo & Examples

## Example Usage

### 1) Create a Google Maps instance
Follow Google's hello world example to create a Google Maps instance.

### 2) Include jQuery and the Map Lasso plugin
Include jQuery. Map Lasso is compatible with jQuery versions greater than 1.4 
```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="jquery.mapLasso.1.0.js" type="text/javascript"></script>
```

### 3) Start the Plugin
Attach the plugin to the DOM element that contains the map. Pass the Google maps map object to the plugin as the map parameter. This is the only required parameter.
```js
$('#map').mapLasso({
	map: map
});

```

## Public Methods
The following public methods are available.

## Events 

## License
This plugin is dual licensed under the MIT and GPL licenses, just like jQuery itself.