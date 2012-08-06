define([
  'knockout',
  'config/global',
  'libs/date'
], function(ko, g){
  'use strict';
  
  
  ko.bindingHandlers.json = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value = valueAccessor();
      value = value.replace(/{\n( *)"start":(.*),\n( *)"stop":(.*),\n( *)"comment":(.*)\n( *)}/g, '{"start:$2, "stop":$4, "comment":$6}');  // un Run est affiché sur une ligne quand il est terminé (avec commentaire)
      value = value.replace(/{\n( *)"start":(.*),\n( *)"stop":(.*)\n( *)}/g, '{"start:$2, "stop":$4}');                                     // un Run est affiché sur une ligne quand il est terminé (sans commentaire)
      value = value.replace(/{\n( *)"start":(.*)\n( *)}/g, '{"start:$2}');                                                                  // un Run est affiché sur une ligne quand il est en cours
      value = value.replace(/\n( *)},\n( *){\n/g, '\n$1},{\n');                                                                             // gain d'une ligne entre 2 éléments d'un tableau (les tâches par ex)
      value = value.replace(/,\n( *)"(.*)": {\n( *)/g, ',\n$1"$2": {');                                                                     // mise sur 1 ligne des objets vides
      value = value.replace(/( *)"_(.*)":(.*)\n/g, '');                                                                                     // suppression de la ligne des propritétés commençant par _
      $(element).text(value);
    }
  };
  
  ko.bindingHandlers.dateString = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        var pattern = allBindings.datePattern || 'dd/MM/yyyy hh:mm:ss';
        if(valueUnwrapped != undefined){
          $(element).text(valueUnwrapped.toString(pattern));
        }
    }
  };
  
  ko.bindingHandlers.msToSimpleTime = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var millis = value;
        var seconds = Math.floor(value/1000);
        var min = Math.floor(seconds/60);
        var hours = Math.floor(min/60);
        var days = Math.floor(hours/24);
        
        if(days > 0){         $(element).text( days +    (days > 1     ? ' days'     : ' day')    );}
        else if(hours > 0){   $(element).text( hours +   (hours > 1    ? ' hours'    : ' hour')   );}
        else if(min > 0){     $(element).text( min +     (min > 1      ? ' minutes'  : ' minute') );}
        else if(seconds > 0){ $(element).text( seconds + (seconds > 1  ? ' seconds'  : ' second') );}
        else if(millis > 0){  $(element).text( millis +  (millis > 1   ? ' millis'   : ' milli')  );}
    }
  };
  
  ko.bindingHandlers.msToTime = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var time = '';
        if(value > 0){
          var millis = value;
          var seconds = Math.floor(value/1000);
          var min = Math.floor(seconds/60);
          var hours = Math.floor(min/60);
          var days = Math.floor(hours/24);
          
          if(days > 0){     var val = days;                     time += val + ( val > 1 ? ' days '     : ' day '    );}
          if(hours > 0){    var val = (hours-(days*24));        time += val + ( val > 1 ? ' hours '    : ' hour '   );}
          if(min > 0){      var val = (min-(hours*60));         time += val + ( val > 1 ? ' minutes '  : ' minute ' );}
          if(seconds > 0){  var val = (seconds-(min*60));       time += val + ( val > 1 ? ' seconds '  : ' second ' );}
          //if(millis > 0){   var val = (millis-(seconds*1000));  time += val + ( val > 1 ? ' millis '   : ' milli '  );}
        } else {
          time = '0 seconds';
        }
        
        $(element).text(time);
    }
  };

  // a custom binding to handle the enter key (could go in a separate library)
  ko.bindingHandlers.enterKey = {
    init: function( element, valueAccessor, allBindingsAccessor, data ) {
      var wrappedHandler, newValueAccessor;

      // wrap the handler with a check for the enter key
      wrappedHandler = function( data, event ) {
        if ( event.keyCode === g.key.enter ) {
          valueAccessor().call( this, data, event );
        }
      };

      // create a valueAccessor with the options that we would want to pass to the event binding
      newValueAccessor = function() {
        return {
          keyup: wrappedHandler
        };
      };

      // call the real event binding's init function
      ko.bindingHandlers.event.init( element, newValueAccessor, allBindingsAccessor, data );
    }
  };

  // wrapper to hasfocus that also selects text and applies focus async
  ko.bindingHandlers.selectAndFocus = {
    init: function( element, valueAccessor, allBindingsAccessor ) {
      ko.bindingHandlers.hasfocus.init( element, valueAccessor, allBindingsAccessor );
      ko.utils.registerEventHandler( element, 'focus', function() {
        element.select();
      } );
    },
    update: function( element, valueAccessor ) {
      ko.utils.unwrapObservable( valueAccessor() ); // for dependency
      // ensure that element is visible before trying to focus
      setTimeout(function() {
        ko.bindingHandlers.hasfocus.update( element, valueAccessor );
      }, 0 );
    }
  };
});