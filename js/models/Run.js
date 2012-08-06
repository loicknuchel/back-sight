define([
  'knockout'
], function(ko){
  'use strict';
  // represent an execution period for a task
  var Run = function( run ) {
    var self = this;
    self.start = ko.observable( run && run.start ? new Date(run.start) : new Date() );
    self.stop = ko.observable( run && run.stop ? new Date(run.stop) : undefined );
    self.comment = ko.observable( run && run.comment ? run.comment : undefined );
    self.close = function(){
      if(self.stop() === undefined){
        self.stop(new Date());
      }
    };
    self.isRunning = function(){
      return self.stop() === undefined;
    };
  };
  return Run;
});
