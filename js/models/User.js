define([
  'knockout',
  'config/global',
  'models/Task'
], function(ko, g, Task){
  'use strict';
  // represent all datas for a user
  var User = function( user ) {
    var self = this;
    if(g.debug && !user.name){
      throw 'user must have a name !';
    }
    
    self.name = ko.observable( user.name );
    self.tasks = ko.observableArray( ko.utils.arrayMap( user.tasks || [] , function( task ) {
      return new Task( task );
    }) );
    // self.tags;
    self.sync = ko.observable( user.sync || g.model.user.sync );
    self.syncUrl = ko.observable( user.syncUrl || g.model.user.syncUrl );
    self.created = ko.observable( user.created || new Date() );
  };
  return User;
});
