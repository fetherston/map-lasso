# Map Lasso, a Lasso Tool for Google Maps

## Demo & Examples



## Example Usage

### 1) Create a Google Maps instance
Follow Google's hello world example to create a Google Maps instance.

### 2) Include jQuery and the Map Lasso plugin file
Map Lasso is compatible with jQuery versions greater than 1.4 
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



## Configuration Options
The below configuration options are available in the Map Lasso plugin and are defined in the configuration object.

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
Width in pixels of the lasso stroke

### strokeColor (string, default: #FF0000)
Color of the lasso stroke in hex.

### strokeOpacity (number 0-1, default: 0.75)
Opacity of the lasso stroke

### fillColor (string, default: #FF0000)
Fill color of the lasso in hex.

### fillOpacity (number 0-1, default: 0.15)
Opacity of the lasso fill

### maxPoints (number, default: 175)
Max points to represent the lasso. If the lasso contains more points than this parameter, a factoring algorithm is used to reduce them to below this number.

### minPoints (number, default: 10)
Minimum number of points before considering the shape a valid lasso.

### map (object, required)
The Google Maps Map object. See Google Maps API for more information.



## Public Methods
The following public methods are available.




## Events 

## License
This plugin is dual licensed under the MIT and GPL licenses, just like jQuery itself.