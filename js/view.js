/** @module view */

/**
 *  UPDATE METHODE
 *  Aktualisiert der Wertungs-Liste */
var WhiskyView = View.extend({
   init : function() {
      this._super();
   },
   /** Sortierung des Tasting-Arrays */
   sortAlg : function(a, b) {
      a = a.distillery.toLowerCase();
      b = b.distillery.toLowerCase();
      return (a == b) ? 0 : (a > b) ? 1 : -1;
   },
   /** GUI aktualisieren */
   update : function(scope, data) {
      var actTitel = "";
      var count = 0;
      var line = "";

      // (1) Alte Listview löschen
      $('#whiskylist ul li').remove();

      var ar = scope.getWertungen();
      // (2) alle Wertungen lesen
      ar.sort(this.sortAlg);
      // und sortieren

      // (3) Durch die Wertungen gehen
      for (var i = 0; i < ar.length; i++) {
         // Titel
         if (ar[i].distillery != actTitel) {
            if (newEntryRowTitle != null) {
               // Anzahl Wertungen der letzten Distillery setzen
               newEntryRowTitle.find('.ui-li-count').text(count);
               count = 0;
            }
            var newEntryRowTitle = $('#titleTemplate').clone();
            actTitel = ar[i].distillery;
            newEntryRowTitle.find('#label').text(actTitel);
            newEntryRowTitle.appendTo('#whiskylist ul');
         }

         // (4) Allg. Informationen
         count++;
         var newEntryRow = $('#entryTemplate').clone();
         newEntryRow.jqmData('entryId', ar[i].guid);
         newEntryRow.find('#ui-li-title').text(ar[i].bezeichnung);
         if (ar[i].proof == "ja")
            newEntryRow.find('#ui-li-fass').html(ar[i].fass + ", Fassstärke");
         else
            newEntryRow.find('#ui-li-fass').html(ar[i].fass);
         newEntryRow.find('#forsearch').text(ar[i].distillery);
         // Finish darstellen
         line = "";
         if (ar[i].finish == "mittel")
            line = line + "&ndash;";
         if (ar[i].finish == "lang")
            line = line + "&ndash;&ndash;";
         if (ar[i].finish == "sehrlang")
            line = line + "&ndash;&ndash;&ndash;";
         newEntryRow.find('.ui-li-aside').html(line);

         // Wertung (Sterne)
         newEntryRow.find('input[value=' + ar[i].wertung + ']').prop('checked', true);
         newEntryRow.find('input[type=radio]').prop('name', 'list-' + i);

         // Bilder setzen
         if (ar[i].gfrucht >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/fruit.png");
         if (ar[i].gsherry >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/cherry.png");
         if (ar[i].gtorf >= 5)
            newEntryRow.find('.ui-li-icon').attr("src", "img/peat.png");

         // Event-Listener setzen auf Clicken
         newEntryRow.click(function(event) {
            event.preventDefault();
            WhiskyApp.controller.edit($(this).jqmData('entryId'));
            return false;
         });

         // (5) Der Liste hinzufügen
         newEntryRow.appendTo('#whiskylist ul');
      }

      // Anzahl Wertungen der letzten Distillery setzen
      if (newEntryRowTitle != null) {
         newEntryRowTitle.find('.ui-li-count').text(count);
      }

      // (6) Alle Radio-Buttons rendern, aber nur die hinzugefügten, nicht das Muster!
      $('#whiskylist ul li input[type=radio]').rating();
   },

   /** GEO-Location update */
   location_update : function(scope, data) {
      if (WhiskyApp.debug)
         console.log("Update Location");

      if (scope.getGUID() == WhiskyApp.controller.getGUID()) {
         var locObj = scope.getLocObj();
         WhiskyApp.controller.setOrt(locObj);
         this.setLocation(locObj);
      }
   },

   setLocation : function(ort) {
      $('#adresse').text(ort.string);
      $('#adrimg').remove();
      if (navigator.onLine)
         $('#adr').prepend('<img src="https://maps.googleapis.com/maps/api/staticmap?center=' + ort.pos + '&amp;zoom=14&amp;size=280x200&amp;markers=' + ort.pos + '&amp;sensor=false" height="200" width="280" id="adrimg" />');
   }
});

/**
 * Bevor die Seite erzeugt wird, je nach Auflösung die Pages/Contents umhängen. */
$(document).bind("pagebeforecreate", function() {
   var winwidth = $(window).width();

   // Je nach Auflösung...
   if (winwidth >= 650) {
      var element = $('#whiskydetail').html();
      $('#whiskydetails').append(element);
      $('#whisky-details').remove();
      WhiskyApp.tablet = true;
   } else {
      $('#whiskylist').removeClass("content-list");
      $('#whiskydetails').remove();
   }

   // Facebook-Button entfernen, wenn API nicht geladen wurde
   if ( typeof FB == "undefined") {
      $('#facebookBar').remove();
   }
});

/**
 * Event für neues Tasting darstellen. */
$(document).on("pagecontainershow", function(event, ui) {   // in jQM 1.4 nicht mehr pageshow sondern pagecontainershow
   if( $( "body" ).pagecontainer( "getActivePage" ).attr("id") == "whisky-home" ) {
      if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Nativ oder Web? -> Kapitel 9
         if (WhiskyApp.tablet == true)
            WhiskyApp.controller.firstView();
      }
   }
});
 