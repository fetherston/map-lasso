/**
 * jQuery Map Lasso
 * Version: 1.0
 * URL: https://github.com/fetherston/Google-Maps-Lasso
 * Description: A lasso tool for Google Maps
 * Requires: jQuery > v1.4
 * Author: Chris Fetherston cfetherston.com
 * Copyright: Copyright 2012 Chris Fetherston
 * License: LICENSE_INFO
 */
(function($){
    $.mapLasso = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("mapLasso", base);

        var lassoLatLong = [];
        var lassoPath = null;
        var lassoPoly = null;

       /* ---------------------------------------------------
        * Start private methods
        * ---------------------------------------------------*/
        var startLassoHandler = function(event) {
          event.preventDefault();

          base.startLasso(event);
        };

        var lassoEscHandler = function(event) {
          console.log(event);
          if (event.keyCode === 27 ) {
            base.clearLasso();
          }
        };

        var initHandlers = function() {
          base.options.startElem.click(startLassoHandler);
        };

        /* ---------------------------------------------------
        * End private methods
        * ---------------------------------------------------*/
        
        /* ---------------------------------------------------
        * Start public methods
        * ---------------------------------------------------*/
        base.init = function(){
            
            base.options = $.extend({},$.mapLasso.defaultOptions, options);

            if (base.options.map === null) {
              alert('Please provide a google maps object.');
            }

            initHandlers();
        };

        base.startLasso = function(startHere) {
          base.clearLasso();
          // create a polyline path to follow the cursor
          var lassoPathOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            clickable: false,
            strokeWeight: 3
          };
          lassoPath = new google.maps.Polyline(lassoPathOptions);   
          lassoPath.setMap(base.options.map);  
          
          // disable scrollzoom and map dragging while lassoing
          base.options.map.setOptions({
            scrollwheel: false,
            draggable: false
          }); 

          console.log(base.$el);

          $('body').keyup(lassoEscHandler).css('cursor', 'crosshair');

          google.maps.event.addListenerOnce(base.options.map, 'mousedown', function(event) {                    
            
            // variables used for panning the map       
            var panTolerance = 40; // tolerance from edge of container in pixels
            var panSpeed = 5; // distance to pan in pixels
            var container = base.$el;
            var containerOffset = container.offset();
            var rightExit = container.innerWidth();
            var bottomExit = container.height();  
            var panning = false;      
            
            var path = lassoPath.getPath();           
            
            // start tracking cursor 
            google.maps.event.addListener(base.options.map, 'mousemove', function(event) {
            
              var panDirection;
              
              // monitor the pixel of the cursor, and pan the map if needed           
              if (event.pixel.x >= rightExit - panTolerance) {
                base.options.map.panBy(panSpeed, 0)
              }           
              else if (event.pixel.x <= containerOffset.left + panTolerance){
                base.options.map.panBy(-panSpeed, 0);
              }           
              else if (event.pixel.y >= bottomExit - panTolerance) {
                base.options.map.panBy(0, panSpeed);
              }         
              else if (event.pixel.y <= panTolerance) {
                base.options.map.panBy(0, -panSpeed);
              }
              
              else {
                panning = false;
              }
              var cursorPosition = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

              // add marker position to lassoLatLong array
              lassoLatLong.push(cursorPosition);
              
              // update the polyline path, keeps line going behind cursor
              path.push(cursorPosition);
            });   
          });   

          // end the lasso
          google.maps.event.addListenerOnce(base.options.map, 'mouseup', function(event) {
            var length = lassoLatLong.length;
          
            // if there's a reasonable amount
            if (length < base.options.maxMarkers && length > base.options.minMarkers) {
              base.endLasso(); // do nothing, end lasso
            } 

            // if there's too many, thin down
            else if (length > base.options.minMarkers) {
            
              var factor = parseInt((length / base.options.maxMarkers)+1);               
              var output = [];
              var i = 0;
              
              for (i=0; i < length; i+=factor) {
                output.push(lassoLatLong[i]);
              };  
              
              // dump unfiltered latlong
              lassoLatLong = [];
              lassoLatLong = output;            
              base.endLasso();   
            }
            // if there's too little, reset
            else {
              base.clearLasso();
            }
          }); 
        };

        base.endLasso = function() {
          $('body').unbind('keyup', lassoEscHandler).css('cursor', 'default');
          google.maps.event.clearListeners(base.options.map, 'mousemove'); // stop tracking cursor   

          // add the lassoed polygon          
          lassoPoly = new google.maps.Polygon({
            path: lassoLatLong,
            clickable: false,
            strokeColor: "#FF0000",
            strokeOpacity: 0.75,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.15
          });
          lassoPoly.setMap(base.options.map);
          if (lassoPath) {
            lassoPath.setMap(null); // remove traced lasso path
          }
          
          setTimeout(function() {
            // restore defaults
            base.options.map.setOptions({
              scrollwheel : true,
              draggable : true
            });
          }, 20);          
        };

        base.clearLasso = function() {
          google.maps.event.clearListeners(base.options.map, 'mousedown');
          google.maps.event.clearListeners(base.options.map, 'mousemove');
          google.maps.event.clearListeners(base.options.map, 'mouseup'); 
          
          // restore defaults
          base.options.map.setOptions({
            scrollwheel: true,
            draggable: true
          });

          console.log(lassoPoly);

          if (lassoPoly !== null) {
            lassoPoly.setMap(null);
            lassoPoly = null;
          }

          if (lassoPath !== null) {
            lassoPath.setMap(null);
            lassoPath = null;
          }
                      
          lassoLatLong = [];
        }; 

        base.getCoords = function() {
          return lassoLatLong;
        };

        /* ---------------------------------------------------
        * end public methods
        * ---------------------------------------------------*/
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.mapLasso.defaultOptions = {
        startElem: $('a.start-lasso'),
        map: null,
        maxMarkers: 175, // tolerance for # of markers 
        minMarkers: 10 // minimum # of markers to start search  
    };
    
    $.fn.mapLasso = function(options){
        return this.each(function(){
            (new $.mapLasso(this, options));


        });
    };
    
})(jQuery);