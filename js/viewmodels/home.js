define([
  'knockout',
  'config/global',
  'utils/Omnibox',
  'utils/Assert',
  'models/User',
  'models/Task',
  'knockout-postbox'
], function(ko, g, Omnibox, Assert, User, Task){
  'use strict';
  
  // our main datas model
  var ViewModel = function() {
    var self = this;
    self.debug = g.debug;
    
    /*
      Lors de la synchronisation, c'est le dernier déclaré qui donne la valeur initiale. 
      Ici c'est celui-ci (car le widget home est après le widget settings dans le html).
      Il est donc nécessaire de passer le initUser depuis les settings jusqu'ici pour que l'application soit correctement initialisée.
    */
    self.curUser = ko.observable().syncWith(g.topic.curUser, true);
        
    self.runningTasks = ko.computed(function() {
      if(self.curUser()){
        return ko.utils.arrayFilter(self.curUser().tasks(), function(task) {
          return task.status() == g.model.task.status.run;
        }).sort(function(left, right){
          return left.startExec() < right.startExec();
        });
      }
    }, self);
    self.waitingTasks = ko.computed(function() {
      if(self.curUser()){
        return ko.utils.arrayFilter(self.curUser().tasks(), function(task) {
          return task.status() == g.model.task.status.wait;
        }).sort(function(left, right){
          return left.name() < left.name();
        });
      }
    }, self);
    self.doneTasks = ko.computed(function() {
      if(self.curUser()){
        return ko.utils.arrayFilter(self.curUser().tasks(), function(task) {
          return task.status() == g.model.task.status.done;
        });
      }
    }, self);
    
    // fields
    self.omniboxText = ko.observable(); // content of omnibox
    self.actionToExecute = ko.computed(function(){
      if(self.curUser()){
        return Omnibox.toHTML(Omnibox.eval(self.omniboxText(), self.curUser().tasks()));
      }
    });
    
    /*self.startTask = function( task )   { task.setStart(); };
    self.stopTask = function( task )    { task.setStop(); };*/
    self.startTask = function( task )   { task.status(g.model.task.status.run); };
    self.stopTask = function( task )    { task.status(g.model.task.status.wait); };
    self.finishTask = function( task )  { task.status(g.model.task.status.done); };
    self.archiveTask = function( task ) { task.status(g.model.task.status.archive); };
    self.deleteTask = function( task )  { self.curUser().tasks.remove( task ); };
    
    /* task ui State */
    self.expandedTask;
    self.expandTask = function( task ){
      if(task.uiState() == ''){
        if(self.expandedTask){
          self.expandedTask.uiState('');
        }
        self.expandedTask = task;
        task.uiState('expanded');
      } else {
        task.uiState('');
      }
    };
    
    // execute action in omnibox
    self.omniEval = function() {
      var omni = Omnibox.eval(self.omniboxText(), self.curUser().tasks());
      console.log(self.omniboxText() + ' => ' + Omnibox.toString(omni));
      var tmpTask = omni.task ? omni.task : (omni.tasks && omni.tasks.length == 1 ? omni.tasks[0] : undefined);
      if(omni.action == g.omnibox.action.add.id){
        if(!omni.task){
          self.curUser().tasks.push( new Task({ name:omni.text }) );
          self.omniboxText( '' );
        } else {
          console.log('"'+omni.text+'" task already exist !');
        }
      } else if((!omni.multi && tmpTask) || (omni.multi && omni.tasks && omni.tasks.length > 0)){
        var exec = true, execFunc;
        
             if(omni.action == g.omnibox.action.start.id    || omni.action == g.omnibox.action.startall.id)   { execFunc = self.startTask; }
        else if(omni.action == g.omnibox.action.stop.id     || omni.action == g.omnibox.action.stopall.id)    { execFunc = self.stopTask; }
        else if(omni.action == g.omnibox.action.finish.id   || omni.action == g.omnibox.action.finishall.id)  { execFunc = self.finishTask; }
        else if(omni.action == g.omnibox.action.archive.id  || omni.action == g.omnibox.action.archiveall.id) { execFunc = self.archiveTask; } 
        else if(omni.action == g.omnibox.action.remove.id   || omni.action == g.omnibox.action.removeall.id)  { execFunc = self.deleteTask; }
        else {
          exec = false;
          console.log('Unknown action id '+omni.action+' (cf g.omnibox.action) !');
        }
        
        if(exec){
          if(omni.multi){
            for(var i=omni.tasks.length-1; i>=0; i--){
              execFunc(omni.tasks[i]);
            }
          } else{
            execFunc(tmpTask);
          }
          self.omniboxText( '' );
        }
      }
    };
    
    
    // to display KO viewmodel content !
    self.plainText = ko.computed(function(){
      return ko.toJSON({user:self.curUser()}, null, 2);
    });
    
  };
  return ViewModel;
});