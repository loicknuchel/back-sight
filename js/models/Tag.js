define([
  'knockout',
  'config/global'
], function(ko, g){
  'use strict';
  var Tag = function( tag ) {
    var self = this;
    if(g.debug && !tag.name){
      throw 'task must have a name !';
    }
    
    self.name = ko.observable( tag.name );
    self.color = ko.observable( tag.color || 'red' );
    self.show = ko.observable( tag.show || true );
  };
  return Tag;
});
