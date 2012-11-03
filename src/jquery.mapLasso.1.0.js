/**
 * jQuery Map Lasso
 * Version: 1.0
 * URL: https://github.com/fetherston/Google-Maps-Lasso
 * Description: A lasso tool for Google Maps
 * Requires: jQuery > v1.4
 * Author: Chris Fetherston cfetherston.com
 * Copyright: Copyright 2012 Chris Fetherston
 * License: MIT and GPL
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
      if (event.keyCode === 27 ) {
        base.clearLasso();
      }
    };

    var initHandlers = function() {
      $(base.options.startElem).on('click', startLassoHandler);
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

    base.startLasso = function() {
      base.clearLasso();
      // create a polyline path to follow the cursor
      var lassoPathOptions = {
        strokeColor: base.options.strokeColor,
        strokeOpacity: base.options.strokeOpacity,
        clickable: false,
        strokeWeight: base.options.strokeWeight
      };
      lassoPath = new google.maps.Polyline(lassoPathOptions);   
      lassoPath.setMap(base.options.map);  
      
      // disable scrollzoom and map dragging while lassoing
      base.options.map.setOptions({
        scrollwheel: false,
        draggable: false
      }); 

      // assign a handler to cancel the lasso on keyup
      $('body').keyup(lassoEscHandler).css('cursor', 'crosshair');

      google.maps.event.addListenerOnce(base.options.map, 'mousedown', function(event) {                    
        
        // variables used for panning the map       
        var panTolerance = 40; // tolerance from edge of container in pixels
        var panSpeed = 5; // distance to pan in pixels
        var containerOffset = base.$el.offset();
        var rightExit = base.$el.innerWidth();
        var bottomExit = base.$el.height();  
        var panning = false;      
        
        var path = lassoPath.getPath();

        // fire the onStart event if provided 
        if (base.options.onStart !== null) {
          base.options.onStart(event);
        }           
        
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
        if (length < base.options.maxPoints && length > base.options.minPoints) {
          base.endLasso(); // do nothing, end lasso
        } 

        // if there's too many, thin down
        else if (length > base.options.minPoints) {
        
          var factor = parseInt((length / base.options.maxPoints)+1);               
          var output = [];
          var i = 0;
          
          for (i=0; i < length; i+=factor) {
            output.push(lassoLatLong[i]);
          };  
          
          // dump unfiltered latlong
          lassoLatLong = [];
          console.log(output.length);
          lassoLatLong = output;            
          base.endLasso();   
        }
        // if there's too little, reset
        else {
          base.clearLasso();
        }

        // fire the onEnd event if specified
        if (base.options.onEnd !== null) {
          base.options.onEnd(event);
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
        strokeColor: base.options.strokeColor,
        strokeOpacity: base.options.strokeOpacity,
        strokeWeight: base.options.strokeWeight,
        fillColor: base.options.fillColor,
        fillOpacity: base.options.fillOpacity
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

    base.getCoords = function(options) {
     /* Returns the lasso coords as google latlng objects 
      * @param options: object, options for return response
      */

      var settings = {
        type: 'latLng'
      };
      var coords = lassoLatLong;

      $.extend(settings, options);

      if (settings.type === 'array') {
        var coords = [];
        $.each(lassoLatLong, function(i, val) {
          coords.push({
            lat: val.lat(),
            lng: val.lng()
          });
        });
      }

      return coords;
    };

    /* ---------------------------------------------------
    * end public methods
    * ---------------------------------------------------*/
    
    // Run initializer
    base.init();
  };
  
  $.mapLasso.defaultOptions = {
    startElem: 'a.start-lasso',
    onStart: null,
    onEnd: null,
    map: null,
    strokeWeight: 3,
    strokeColor: '#FF0000',
    strokeOpacity: 0.75,
    fillColor: '#FF0000',
    fillOpacity: 0.15,
    maxPoints: 175, // tolerance for # of markers 
    minPoints: 10 // minimum # of markers to start search  
  };
  
  $.fn.mapLasso = function(options){
    return this.each(function(){
        (new $.mapLasso(this, options));
    });
  };
    
})(jQuery);