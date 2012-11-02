# Map Lasso, a Lasso Tool for Google Maps
A plugin for Google Maps for drawing shapes with the mouse or touch device. Once a shape is defined, its coordinates can be retrieved for use in your application. Works on all browsers and most mobile devices.

## Demo & Examples



## Example Usage

### 1) Create a Google Maps instance
Follow Google's hello world example to create a Google Maps instance. Insure that the Google Maps object is available in the same scope as where the plugin will be started.

### 2) Include jQuery and the Map Lasso plugin file
Map Lasso is compatible with jQuery versions greater than 1.4 
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
<script src="jquery.mapLasso.1.0.js" type="text/javascript"></script>
```

### 3) Start the Plugin
Attach the plugin to the DOM element that contains the map. Pass the Google Maps object to the plugin as the map parameter. This is the only required parameter.
```js
$('#map').mapLasso({
	map: map
});

```



## Configuration Options
The following configuration options are available in the Map Lasso plugin and are defined in the configuration object.

### Example
```js
$('#map').mapLasso({
    startElem: $('a.start-lasso'),
    map: map,
    strokeWeight: 3,
    strokeColor: '#FF0000'
};
```

### startElem (jQuery selector, default: $('a.start-lasso'))
jQuery Selector: A DOM element that will start the lasso tool on click.

### strokeWeight (number, default: 3)
Width in pixels of the lasso stroke.

### strokeColor (string, default: #FF0000)
Color of the lasso stroke in hex.

### strokeOpacity (number 0-1, default: 0.75)
Opacity of the lasso stroke

### fillColor (string, default: #FF0000)
Fill color of the lasso in hex.

### fillOpacity (number 0-1, default: 0.15)
Opacity of the lasso fill.

### maxPoints (number, default: 175)
Max points to represent the lasso. If the lasso contains more points than this parameter, a factoring algorithm is used to reduce them to below this number.

### minPoints (number, default: 10)
Minimum number of points before considering the shape a valid lasso.

### map (object, required)
The Google Maps object. See Google Maps API for more information.



## Public Methods
The following public methods are available and are accessed via the jQuery data object of the element the plugin was assigned to.

### Example
```js
$('.get-coords').click(function(event) {
	console.log($('#map').data('mapLasso').getCoords());
});
```

### getCoords()
Returns the coordinates of the lasso tool as an array of Google Maps latlng objects.

### clearLasso()
Clears the lasso from the map.




## Events 




## License
This plugin is dual licensed under the MIT and GPL licenses.