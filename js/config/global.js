// Author: Loïc Knuchel <loicknuchel@gmail.com>

define({
  debug: false,
  key: {
    enter: 13
  },
  topic: {
    curUser: 'current-user-topic'
  },
  storage: {
    users: 'back-sight-users'
  },
  widget: {
    classes: 'widgetBlock',
    attrName: 'data-widget-name'
  },
  model: {
    task: {
      status: { wait:'wait', run:'run', done:'done', archive:'archive' }
    },
    user: {
      sync: false,
      syncUrl: ''
    }
  },
  omnibox: {
    action: {
      add:        {id:1,  name:'créer',     keys:['create','add','new','+'],                    multi:false },
      remove:     {id:2,  name:'supprimer', keys:['delete','rm','-'],                           multi:false },
      removeall:  {id:3,  name:'supprimer', keys:['delete-all','delete*','rm-all','rm*','-*'],  multi:true  },
      start:      {id:4,  name:'démarrer',  keys:['start','run','>'],                           multi:false },
      startall:   {id:5,  name:'démarrer',  keys:['start-all','start*','run-all','run*','>*'],  multi:true  },
      stop:       {id:6,  name:'arrêter',   keys:['stop','/'],                                  multi:false },
      stopall:    {id:7,  name:'arrêter',   keys:['stop-all','stop*','/*'],                     multi:true  },
      finish:     {id:8,  name:'terminer',  keys:['finish','|'],                                multi:false },
      finishall:  {id:9,  name:'terminer',  keys:['finish-all','finish*','|*'],                 multi:true  },
      archive:    {id:10, name:'archiver',  keys:['archive','[]'],                              multi:false },
      archiveall: {id:11, name:'archiver',  keys:['archive-all','archive*','[]*'],              multi:true  }
    }
  },
  moment: {
    fr: {
      months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
      monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
      weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
      weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
      weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
      longDateFormat : {
        LT : "HH:mm",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
      },
      calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
      },
      relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
      },
      ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
      }
    }
  }
});