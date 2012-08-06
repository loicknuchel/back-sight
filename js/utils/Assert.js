// Author: Loïc Knuchel <loicknuchel@gmail.com>

define([
  'knockout',
  'config/global'
], function(ko, g){
  'use strict';
  
  var Assert = (function() {
    /*private boolean*/ function isEmpty(/**/ obj){
      return typeof obj === 'undefined' || !obj || obj === undefined || obj === null || obj === '';
    }
    
    /*public void*/ function notEmpty(/*object*/ obj){ if(isEmpty(obj)){ throw '('+obj+') can\'t be empty !'; } }
    /*public void*/ function empty(/*object*/ obj){ if(!isEmpty(obj)){ throw '('+obj+') can\'t be empty !'; } }
    
    return {
      notEmpty: notEmpty,
      empty: empty
    };
  })();
  
  return Assert;
});
