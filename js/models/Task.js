define([
  'knockout',
  'config/global',
  'models/Run',
  'moment'
], function(ko, g, Run, moment){
  'use strict';
  moment.lang('fr', g.moment.fr);
  
  // represent a single task item
  var Task = function( task ) {
    var self = this;
    if(g.debug && !task.name){
      throw 'task must have a name !';
    }
    
    /*public String*/ self.name = ko.observable( task.name );
    /*public String*/ self.description = ko.observable( task.description || '' );
    /*public String[]*/ // self.commentaires;
    /*public Run[]*/ self.runs = ko.observableArray( ko.utils.arrayMap( task.runs || [] , function( run ) {
      return new Run( run );
    }) );
    /*public Tag[]*/ // self.tags;
    /*public String*/ // self.priority;
    /*public String*/ self.status = ko.observable( task.status || g.model.task.status.wait );
    
    /*public Date*/ self.created = ko.observable( task.created || new Date() );
    /*public Date*/ self.finished = ko.observable( task.finished || undefined );
    /*public String*/ self.uiState = ko.observable( task.uiState || '' );
    
    
    /***************************************************/
    /* logic used to calculate live Run execution time */
    /***************************************************/
    
    /*private Run*/ var lastRun = ko.observable(self.runs().length > 0 ? self.runs()[self.runs().length-1] : undefined);
    /*public Date*/ self.startExec = ko.computed(function(){ return lastRun() ? lastRun().start() : undefined });
    /*public String*/ self.runComment = ko.computed(function(){ return lastRun() ? lastRun().comment : undefined });
    
    /*private moment*/ var startMoment;
    /*private interval*/ var interval;
    /*private moment*/ self.timer = ko.observable(undefined);
    /*public String*/ self.startPeriod = ko.computed(function(){
      if(self.timer()){
        return 'démarré '+startMoment.from(self.timer());
      }
      return undefined;
    });
    
    // intercept status change for launch/stop actions when task start (run) or stop (wait)
    /*private void*/ self.intercept = ko.computed(function(){
      if(self.status().equals(g.model.task.status.run)){
        // on ajoute un Run si on lance la tâche (cad pas encore de Run ou le dernier Run n'est pas en cours d'exécution)
        //if(self.runs().length === 0 || self.runs()[self.runs().length-1].isRunning() === false){
        if(!lastRun() || lastRun().isRunning() === false){
          lastRun(new Run());
          self.runs.push( lastRun() );
        }
        
        // pour les tâches qui sont en run
        //if(self.runs().length > 0){
        if(lastRun()){
          startMoment = moment(lastRun().start());
          self.timer(moment(new Date()));
          interval = setInterval(function(){
            self.timer(moment(new Date()));
          }, 1000);
        } else {
          //throw 'Error : runSize:'+self.runs().length;
          throw 'Error : lastRun:'+lastRun();
        }
      } else if(self.status().equals(g.model.task.status.wait)){
        // on termine le dernier Run si la tâche est arrêtée (cad le dernier Run est en cours d'exécution)
        //var nbRuns = self.runs().length;
        //if(nbRuns > 0 && self.runs()[nbRuns-1].isRunning()){
        if(lastRun() && lastRun().isRunning()){
          //self.runs()[nbRuns-1].close();
          lastRun().close();
          
          self.timer(undefined);
          startMoment = undefined;
          clearInterval(interval);
        }
      }
      
      return undefined;
    });
    
    
  };
  return Task;
});
