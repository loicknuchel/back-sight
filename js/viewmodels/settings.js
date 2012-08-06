define([
  'knockout',
  'config/global',
  'models/User',
  'knockout-postbox'
], function(ko, g, User){
  'use strict';
  
  // our main view model
  var ViewModel = function( datas ) {
    var self = this;
    
    // all users stored in local
    self.users = ko.observableArray( ko.utils.arrayMap( datas.users, function( user ) {
      return new User( user );
    }));
    
    // set the selected user to current user
    self.curUser = ko.observable( (function(users, selected){
        if(users && users.length > 0){
          for(var i in users){
            if(users[i].name() == selected){
              return users[i];
            }
          }
          return users[0];
        }
      })(self.users(), datas.selected) ).syncWith(g.topic.curUser);
    
    // fields
    self.addUserField = ko.observable();
    
    // methods
    self.addUser = function() {
      var addUserField = self.addUserField().trim();
      if ( addUserField ) {
        var newUser = new User({ name:addUserField });
        self.users.push( newUser );
        self.curUser( newUser );
        self.addUserField( '' );
      }
    };
    
    self.deleteCurUser = function() {
      var name = self.curUser().name();
      self.users.remove(function(user){
        return user.name() == name;
      });
      if(self.users.length > 0){
        self.curUser(self.users[0]);
      } else {
        self.curUser(undefined);
      }
    };
    
    // internal computed observable that fires whenever anything changes in our tasks
    ko.computed(function() {
      localStorage.setItem( g.storage.users, ko.toJSON( {selected:self.curUser() ? self.curUser().name : undefined, users:self.users} ) );
    }).extend({
      throttle: 500
    }); // save at most twice per second
    
  };
  
  return ViewModel;
});
