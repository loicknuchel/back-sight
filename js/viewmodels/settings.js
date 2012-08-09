define([
  'knockout',
  'config/global',
  'models/User',
  'knockout-postbox'
], function(ko, g, User){
  'use strict';
  
  // our main view model
  var ViewModel = function( settings, curUsername, users ) {
    var self = this;
    
    self.settings = ko.observable( settings );
    self.curUsername = ko.observable( curUsername ).syncWith(g.topic.curUsername);
    self.users = ko.observableArray( users );
    
    // fields
    self.addUserField = ko.observable();
    
    // methods
    self.addUser = function() {
      var addUserField = self.addUserField().trim();
      if ( addUserField ) {
        self.users.push( addUserField );
        self.curUsername( addUserField );
        self.addUserField( '' );
      }
    };
    
    self.deleteCurUser = function() {
      var name = self.curUsername();
      self.users.remove(function(item){
        return item === name;
      });
      localStorage.removeItem( g.storage.user+'-'+name );
      if(self.users().length > 0){
        self.curUsername(self.users()[0]);
      } else {
        self.curUsername(undefined);
      }
    };
    
    // internal computed observable that fires whenever anything changes in our tasks
    ko.computed(function(){
      localStorage.setItem( g.storage.settings, ko.toJSON( self.settings() || {} ) );
    }).extend({ throttle: 500 }); // save at most twice per second
    ko.computed(function(){
      localStorage.setItem( g.storage.curUsername, ko.toJSON( self.curUsername() || {} ) );
    }).extend({ throttle: 500 }); // save at most twice per second
    ko.computed(function(){
      localStorage.setItem( g.storage.users, ko.toJSON( self.users() || [] ) );
    }).extend({ throttle: 500 }); // save at most twice per second
    
  };
  return ViewModel;
});
