// Author: Loïc Knuchel <loicknuchel@gmail.com>

define([
  'knockout',
  'config/global'
], function(ko, g){
  'use strict';
  
  var Omnibox = (function() {
    var actionDefault = g.omnibox.action.add;
    
    /*public evalObj*/ function evalText(/*string*/ initText, /*Task[]*/ initTasks){
      var text = initText ? initText.trim() : initText;
      if(text && text.length > 0){
        var ret = new Object();
        
        // find action
        for(var i in g.omnibox.action){
          var action = g.omnibox.action[i];
          for(var j in action.keys){
            if(text.indexOf(action.keys[j]+' ', 0) == 0 || text.equals(action.keys[j])){
              ret.action = action.id;
              ret.actionName = action.name;
              ret.multi = action.multi;
              text = text.substring(action.keys[j].length+1, text.length).trim();
              break;
            }
          }
          if(ret.action){
            break;
          }
        }
        if(!ret.action){
          ret.action = actionDefault.id;
          ret.actionName = actionDefault.name;
        }
        
        // select task list to filter
        var evaluatedTasks;
        if(ret.action == g.omnibox.action.start.id || ret.action == g.omnibox.action.startall.id){
          evaluatedTasks = ko.utils.arrayFilter(initTasks, function(task) {
            return task.status() == g.model.task.status.wait;
          });
        } else if(ret.action == g.omnibox.action.stop.id || ret.action == g.omnibox.action.stopall.id){
          evaluatedTasks = ko.utils.arrayFilter(initTasks, function(task) {
            return task.status() == g.model.task.status.run;
          });
        } else if(ret.action == g.omnibox.action.finish.id || ret.action == g.omnibox.action.finishall.id){
          evaluatedTasks = ko.utils.arrayFilter(initTasks, function(task) {
            return task.status() == g.model.task.status.wait;
          });
        } else if(ret.action == g.omnibox.action.archive.id || ret.action == g.omnibox.action.archiveall.id){
          evaluatedTasks = ko.utils.arrayFilter(initTasks, function(task) {
            return task.status() == g.model.task.status.done;
          });
        } else if(ret.action == g.omnibox.action.remove.id || ret.action == g.omnibox.action.removeall.id){
          evaluatedTasks = ko.utils.arrayFilter(initTasks, function(task) {
            return task.status() == g.model.task.status.done || task.status() == g.model.task.status.wait;
          });
        } else {
          evaluatedTasks = initTasks;
        }
        
        // select match tasks
        if(text == '*'){
          ret.tasks = evaluatedTasks;
        } else if(text.length > 0 && evaluatedTasks && evaluatedTasks.length > 0){
          if(ret.action !== g.omnibox.action.add.id && isTaskNumbers(text)){
            // find tasks with range numbers like : #5 or #2-4
            var min = getTaskNumbersMin(text);
            var max = getTaskNumbersMax(text);
            if(0 <= min && min <= max && max < evaluatedTasks.length){
              for(var i=0; i<evaluatedTasks.length; i++){
                if(min <= i && i <= max){
                  if(!ret.tasks){
                    ret.tasks = new Array();
                  }
                  ret.tasks.push(evaluatedTasks[i]);
                }
              }
            }
          } else {
            // remove \ in first position (echap #2 with \#2)
            if(text[0] == '\\'){ text = text.substring(1, text.length).trim(); }
            
            // find tasks with text included in name
            for(var i in evaluatedTasks){
              if(evaluatedTasks[i].name().equalsIgnoreCase(text)){
                ret.task = evaluatedTasks[i];
              } else if(evaluatedTasks[i].name().toUpperCase().indexOf(text.toUpperCase()) != -1){
                if(!ret.tasks){
                  ret.tasks = new Array();
                }
                ret.tasks.push(evaluatedTasks[i]);
              }
            }
          }
        }
        
        ret.text = text;
        
        return ret;
      } else {
        return {text:''};
      }
    }
    
    /*public string*/ function beautify(/*string*/ initText){
      var text = initText ? initText.trim() : initText;
      if(text && text.length > 0){
        // find action
        var cmdAction;
        for(var i in g.omnibox.action){
          var action = g.omnibox.action[i];
          for(var j in action.keys){
            if(text.indexOf(action.keys[j]+' ', 0) == 0 || text.equals(action.keys[j])){
              cmdAction = action.keys[0]+' ';
              text = text.substring(action.keys[j].length+1, text.length).trim();
              break;
            }
          }
          if(cmdAction){
            break;
          }
        }
        if(!cmdAction){
          cmdAction = actionDefault.keys[0]+' ';
        }
        
        return cmdAction + text;
      } else {
        return '';
      }
    }
    
    /*private boolean*/ function isTaskNumbers(/*string*/ text){
      var exp = new RegExp('^#[1-9]([0-9])*(-[1-9]([0-9])*)?$', 'g');
      return exp.test(text);
    }
    
    /*private int*/ function getTaskNumbersMin(/*string*/ text){
      if(text.indexOf('-') != -1){
        return parseInt(text.substring(1, text.indexOf('-'))) - 1;
      } else {
        return parseInt(text.substring(1, text.length)) - 1;
      }
    }
    
    /*private int*/ function getTaskNumbersMax(/*string*/ text){
      if(text.indexOf('-') != -1){
        return parseInt(text.substring(text.indexOf('-')+1, text.length)) - 1;
      } else {
        return parseInt(text.substring(1, text.length)) - 1;
      }
    }
    
    /*public string*/ function toString(/*evalObj*/ evalObj){
      return toText(evalObj, '"', '"', '', '', '"', '"');
    }
    
    /*public string*/ function toHTML(/*evalObj*/ evalObj){
      return toText(evalObj, '<span class="label label-info">', '</span>', '<span class="error">', '</span>', '<span class="label label-important">', '</span>');
    }
    
    /*private string*/ function toText(/*evalObj*/ evalObj, /*string*/ lbl1, /*string*/ lbl2, /*string*/ err1, /*string*/ err2, /*string*/ errlbl1, /*string*/ errlbl2){
      if(evalObj.action){
        if(evalObj.action == g.omnibox.action.add.id){
          if(evalObj.task){
            return err1+'La tâche "' + evalObj.text + '" existe déjà !'+err2;
          } else if(evalObj.text && evalObj.text.length > 0){
            return evalObj.actionName + ' la tâche "' + evalObj.text + '"';
          } else {
            return evalObj.actionName + ' ...';
          }
        } else {
          var tmpTask = evalObj.task ? evalObj.task : (evalObj.tasks && evalObj.tasks.length == 1 ? evalObj.tasks[0] : undefined);
          if(!evalObj.multi && tmpTask){
            return evalObj.actionName + ' la tâche '+ lbl1 + tmpTask.name() + lbl2;
          } else if(evalObj.multi && evalObj.tasks && evalObj.tasks.length > 0){
            var s = evalObj.actionName + ' les tâches ('+evalObj.tasks.length+') :';
            for(var i = 0; i<evalObj.tasks.length; i++){
              s += ' ' + lbl1 + evalObj.tasks[i].name() + lbl2;
            }
            return s;
          } else if(evalObj.text && evalObj.text.length > 0){
            if(evalObj.multi){
              return err1+'Pas de tâches à ' + evalObj.actionName + ' similaires à "' + evalObj.text + '"'+err2;
            } else {
              if(evalObj.tasks && evalObj.tasks.length > 1){
                var s = err1+'Trop de résultats à ' + evalObj.actionName + ' ( '+evalObj.tasks.length+' tâches correspondantes :';
                for(var i = 0; i<evalObj.tasks.length; i++){
                  s += ' ' + errlbl1 + evalObj.tasks[i].name() + errlbl2;
                }
                return s + ' )'+err2;
              } else {
                return err1+'Impossible de ' + evalObj.actionName + ' la tâche "' + evalObj.text + '" : elle n\'existe pas !'+err2;
              }
            }
          } else {
            return evalObj.actionName + ' ...';
          }
        }
      }
    }
    
    return {
      eval: evalText,
      beautify: beautify,
      toHTML: toHTML,
      toString: toString
    };
  })();
  
  return Omnibox;
});
