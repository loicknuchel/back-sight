define(function(){
  'use strict';
  
  // extend native string object
  if ( !String.prototype.trim ) {
    String.prototype.trim = function() {
      return this.replace( /^\s+|\s+$/g, '' );
    };
  }
  
  if ( !String.prototype.equals ) {
    String.prototype.equals = function(s) {
      return this === s;
    };
  }
  
  if ( !String.prototype.equalsIgnoreCase ) {
    String.prototype.equalsIgnoreCase = function(s) {
      return this.toUpperCase() === s.toUpperCase();
    };
  }
  
  
});