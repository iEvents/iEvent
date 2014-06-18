/** @module main */

/* Juni 2014: Update auf jQM 1.3.2 
   Juni 2014: Update auf jQM 1.4.2 */

/** WhiskyApp-Objekt, Referenzen auf alle Module */
var WhiskyApp = {
   tastings : new Tastings(),
   controller : new WhiskyAppController(),
   gui : new WhiskyView(),
   tablet : false,
   db : new WhiskyDB(),
   locAPI : new Location(),
   cloud : new WhiskyCloud(),
   debug : false,
   domain : "whisky.xapps.ch"
}

/* jQM 1.4: Verwendung des Datepickers aus jQuery.ui */
$.datepicker.setDefaults({
   dateFormat: "dd.mm.yy",
   prevText: '&#x3c;zurück', prevStatus: '',
   prevJumpText: '&#x3c;&#x3c;', prevJumpStatus: '',
   nextText: 'Vor&#x3e;', nextStatus: '',
   nextJumpText: '&#x3e;&#x3e;', nextJumpStatus: '',
   currentText: 'heute', currentStatus: '',
   todayText: 'heute', todayStatus: '',
   clearText: '-', clearStatus: '',
   closeText: 'schließen', closeStatus: '',
   monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
   monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun', 'Jul','Aug','Sep','Okt','Nov','Dez'],
   dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
   dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
   dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
   showMonthAfterYear: false
});


if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Nativ oder Web? -> Kapitel 9
   // Observer auf Tastings
   WhiskyApp.tastings.addObserver(WhiskyApp.gui, "update");
   WhiskyApp.tastings.addObserver(WhiskyApp.db, "update");
   WhiskyApp.db.readWertungen();

   // Observer auf GEO-Location
   WhiskyApp.locAPI.addObserver(WhiskyApp.gui, "location_update");

   // Destillerien laden
   WhiskyApp.cloud.checkDistilleries();
}