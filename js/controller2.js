/** @module controller */

/** Controller */
var WhiskyAppController = function() {
   /** @lends WhiskyAppController */
   var actWertung;
   // Aktuell bearbeitete Wertug
   var valid = new Validator();

   /** Zurück auf Home.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function home() {
      if (WhiskyApp.tablet == true) {
         $('#delDialog').popup('close');
         // Einfach schliessen, auch wenn nicht offen
         addTasting();
      } else
         //$.mobile.changePage("#whisky-home", {
         $( "body" ).pagecontainer( "change", "#whisky-home", {   // geändert in jQM 1.4
            transition : "none"
         });
   }

   /** Neue Wertung erstellen.
    * Quelle: whisky-home
    * Ziel: whisky-details */
   function addTasting() {
      $.mobile.silentScroll();

      // Datum ermitteln, leider muss das ganz genau stimmen
      var ldate = new Date();
      var disp_date = "";
      if ((ldate.getMonth() + 1) < 10) {
         if (ldate.getDate() < 10)
            disp_date = "0" + ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
         else
            disp_date = ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
      } else {
         if (ldate.getDate() < 10)
            disp_date = "0" + ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
         else
            disp_date = ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
      }

      // Neues Tasting mit Default-Werten löschen
      actWertung = new Wertung(disp_date, "", "", "Barrel", "ja", "nein", "", "2", "0", "0", "0", "0", "0", "0", "mittel", "", "");

      // und so tun, als ob es eine gäbe...
      edit();

      WhiskyApp.locAPI.start(actWertung.guid);

      valid.validate();
      // erstmalige Validierung
   }

   /** Wertung darstellen zum editieren
    * Quelle: whisky-home
    * Ziel: whisky-details */
   function edit(guid) {
      $.mobile.silentScroll();

      // aktuelle Wertung merken
      if (guid != undefined)
         actWertung = WhiskyApp.tastings.getWertungByID(guid);

      // Page wechseln
      if (WhiskyApp.tablet == false)
         $( "body" ).pagecontainer( "change", "#whisky-details", {   // geändert in jQM 1.4
            transition : "none"
         });

      // Alle Events löschen
      $('#torf', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');
      $('#sherry', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');
      $('#holz', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');
      $('#frucht', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');
      $('#flora', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');
      $('#feinty', $( "body" ).pagecontainer( "getActivePage" )).unbind('change');

      // Werte setzen
      refreshWertung();
      valid.validate();

      addSliderEvents();
      plotUpdate();
   }

   /** Wertung löschen.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function deleteWertung() {
      if (actWertung != null)
         WhiskyApp.tastings.deleteID(actWertung.guid);

      if (WhiskyApp.tablet == true)
         addTasting();

//      $.mobile.changePage("#whisky-home", {
         $( "body" ).pagecontainer( "change", "#whisky-home", {   // geändert in jQM 1.4
            transition : "none"
      });
   }

   /** Wertung speichern.
    * Quelle: whisky-details
    * Ziel: whisky-home */
   function saveWertung() {
      var w;
      // Eintrag hinzufügen
      if (actWertung == null)
         w = new Wertung();
      else// Wertung updaten
         w = actWertung;

      // validierung
      if (valid.validate() == false)
         return false;

      // Felder holen
      w.date = $('#date', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.distillery = $('#distillery', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.bezeichnung = $('#bezeichnung', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.fass = $('#fass', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.finishing = $('#finishing', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.proof = $('#proof', $( "body" ).pagecontainer( "getActivePage" )).val();
      //w.nr = $('#probennr', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.nr = $('#bildView', $( "body" ).pagecontainer( "getActivePage" )).attr('src');
      w.wertung = $("input:radio:checked[name='wertung']", $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gtorf = $('#torf', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gsherry = $('#sherry', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gholz = $('#holz', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gfrucht = $('#frucht', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gflora = $('#flora', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.gfeinty = $('#feinty', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.finish = $('#finish', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.kommentar = $('#kommentar', $( "body" ).pagecontainer( "getActivePage" )).val();

      // Eintrag hinzufügen/erzeugen (wird in Methode entschieden)
      WhiskyApp.tastings.edit(w);

      if (WhiskyApp.tablet == false)
//         $.mobile.changePage("#whisky-home", {
         $( "body" ).pagecontainer( "change", "#whisky-home", {   // geändert in jQM 1.4
            transition : "none"
         });
      else
         addTasting();
   }

   /** About-Seite als Dialog.
    * Quelle: whisky-home
    * Ziel: about.html */
   function about() {
//      $.mobile.changePage("about.html", {
      $( "body" ).pagecontainer( "change", "about.html", {   // geändert in jQM 1.4
         transition : "none",
         role : "dialog",
         changeHash: true
      });
   }

   /** Aktualisiert Wertungs-Page
    */
   function refreshWertung() {
      // Zuweisungen
      $('#date', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.date);
      $('#distillery', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.distillery);
      $('#bezeichnung', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.bezeichnung);
      $('#fass', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.fass).selectmenu("refresh");
      $('#proof', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.proof).flipswitch("refresh"); // new in jQM 1.4
      $('#finishing', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.finishing).flipswitch("refresh"); // new in jQM 1.4
      //$('#probennr', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.nr);
      if( actWertung.nr.length > 0 )
         $('#bildView').attr( 'src', actWertung.nr);
      else
         $('#bildView').attr( 'src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
      $('#wertung', $( "body" ).pagecontainer( "getActivePage" )).rating('select', actWertung.wertung - 1);
      $('#torf', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gtorf).slider("refresh");
      $('#sherry', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gsherry).slider("refresh");
      $('#holz', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gholz).slider("refresh");
      $('#frucht', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gfrucht).slider("refresh");
      $('#flora', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gflora).slider("refresh");
      $('#feinty', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.gfeinty).slider("refresh");
      $('#finish', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.finish).selectmenu("refresh");
      $('#kommentar', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.kommentar);

      var ort = actWertung.ort;
      if (ort == "") {
         $('#adresse', $( "body" ).pagecontainer( "getActivePage" )).text("");
         $('#adrimg', $( "body" ).pagecontainer( "getActivePage" )).remove();
      } else {
         WhiskyApp.gui.setLocation(ort);
      }
   }

   /** Plot aktualisieren */
   function plotUpdate() {
      var options = {
         series : {
            stack : 0,
            lines : {
               show : false,
               steps : false
            },
            bars : {
               show : true,
               barWidth : 0.9,
               align : 'center'
            }
         },
         xaxis : {
            ticks : [[1, 'Torf'], [2, 'Sherry'], [3, 'Holz'], [4, 'Frucht'], [5, 'Flora'], [6, 'Feinty']]
         },
         yaxis : {
            min : 0,
            max : 6
         }
      };

      if ($('#name', $( "body" ).pagecontainer( "getActivePage" )).val() != "") {
         var data = [{
            label : "Wertung",
            data : [[1, $('#torf', $( "body" ).pagecontainer( "getActivePage" )).val()], [2, $('#sherry', $( "body" ).pagecontainer( "getActivePage" )).val()], [3, $('#holz', $( "body" ).pagecontainer( "getActivePage" )).val()], [4, $('#frucht', $( "body" ).pagecontainer( "getActivePage" )).val()], [5, $('#flora', $( "body" ).pagecontainer( "getActivePage" )).val()], [6, $('#feinty', $( "body" ).pagecontainer( "getActivePage" )).val()]]
         }];
      } else {
         var data = [{
            label : "Wertung",
            data : [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]]
         }];
      }
      $.plot($("#chart", $( "body" ).pagecontainer( "getActivePage" )), data, options);
   }

   /** Slider-Events registrieren */
   function addSliderEvents() {
      // Slider-Events registrieren
      $('#torf', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
      $('#sherry', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
      $('#holz', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
      $('#frucht', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
      $('#flora', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
      $('#feinty', $( "body" ).pagecontainer( "getActivePage" )).bind('change', function(event) {
         event.preventDefault();
         plotUpdate();
         return false;
      });
   }

   /** Facebook-Veröffentlichung */
   function toFacebook() {
      var w = actWertung;
      w.distillery = $('#distillery', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.bezeichnung = $('#bezeichnung', $( "body" ).pagecontainer( "getActivePage" )).val();
      w.wertung = $("input:radio:checked[name='wertung']", $( "body" ).pagecontainer( "getActivePage" )).val();
      w.kommentar = $('#kommentar', $( "body" ).pagecontainer( "getActivePage" )).val();
      WhiskyApp.cloud.feedOnFacebook(w);
   }

   /** Backup / Restore Dialog
    * Quelle: whisky-home
    * Ziel: whisky-sync */
   function backupdialog() {
      $('#username').val(localStorage.getItem('WhiskyCloud_BenutzerName'));
      $( "body" ).pagecontainer( "change", "#whisky-sync", {   // geändert in jQM 1.4
         transition : "none"
      });
   }

   /** Backup
    * Quelle: whisky-sync
    * Ziel: whisky-home */
   function backup() {
      if ($('#pwd').val() !== "" && $('#username').val() !== "") {
         localStorage.setItem('WhiskyCloud_BenutzerName', $('#username').val());
         WhiskyApp.cloud.backup($('#username').val(), $('#pwd').val());
//         $.mobile.changePage("#whisky-home", {
         $( "body" ).pagecontainer( "change", "#whisky-home", {   // geändert in jQM 1.4
            transition : "none"
         });
      }
   }

   /** Restore
    * Quelle: whisky-sync
    * Ziel: whisky-home */
   function restore() {
      if ($('#pwd').val() !== "" && $('#username').val() !== "") {
         localStorage.setItem('WhiskyCloud_BenutzerName', $('#username').val());
         WhiskyApp.cloud.restore($('#username').val(), $('#pwd').val());
//         $.mobile.changePage("#whisky-home", {
         $( "body" ).pagecontainer( "change", "#whisky-home", {   // geändert in jQM 1.4
            transition : "none"
         });
      }
   }

   /** Liest das Bild ein und stellt es dar */
   function handleFileSelect(evt) {
      if(typeof FileReader == "undefined")
         return true;

      var file = evt.target.files[0]; // Nur eine Auswahl
      var elem = $(this);

      if (file.type.match('image.*')) {
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e) {
               var image = e.target.result;
               $('#bildView').attr( 'src', image);
            };
        })(file);
        reader.readAsDataURL(file);
      }
   }

   /** Init */
   return {
      initialize : function() {
         // Bild
         $("#bild").change( handleFileSelect );

         // Add-Button in der Liste
         $("#newWertung").bind('vclick', function(event) {
            event.preventDefault();
            addTasting();
            return false;
         });

         // About-Dialog
         $("#about").click(about);

         // Home-Button
         $("#home").click(home);

         // Delete-Button
         $("#delWertung").click(function() {
            $('#delDialog').popup('open')
         });
         $("#delRealy").click(function(event) {
            event.preventDefault();
            deleteWertung();
            return false;
         });
         $("#delNo").click(function() {
            $('#delDialog').popup('close')
         });

         // Save-Button
         $("#saveWertung").bind('vclick', function(event) {
            event.preventDefault();
            saveWertung();
            return false;
         });

         // Tooltips
         $("#labelTorf").bind('click', function() {
            $('#tooltipTorf').popup('open', {
               positionTo : '#torf'
            })
         });
         $("#labelSherry").bind('click', function() {
            $('#tooltipSherry').popup('open', {
               positionTo : '#sherry'
            })
         });
         $("#labelHolz").bind('click', function() {
            $('#tooltipHolz').popup('open', {
               positionTo : '#holz'
            })
         });
         $("#labelFrucht").bind('click', function() {
            $('#tooltipFrucht').popup('open', {
               positionTo : '#frucht'
            })
         });
         $("#labelFlora").bind('click', function() {
            $('#tooltipFlora').popup('open', {
               positionTo : '#flora'
            })
         });
         $("#labelFeinty").bind('click', function() {
            $('#tooltipFeinty').popup('open', {
               positionTo : '#feinty'
            })
         });

         // Live-Validierung
         valid.autoValidate();

         // Slider-Events
         addSliderEvents();

         // Facebook
         $("#facebook").click(toFacebook);

         // Backup / Restore
         $("#sync").bind('vclick', backupdialog);
         $("#backup").bind('vclick', backup);
         $("#restore").bind('vclick', restore);

         // Distillery-Suche
         $("#distillery").autocomplete({
            target : $('#suggestions'),
            source : WhiskyApp.cloud.distilleries,
            callback : function(e) {
               var $a = $(e.currentTarget);
               $('#distillery', $( "body" ).pagecontainer( "getActivePage" )).val($a.text());
               $('#distillery', $( "body" ).pagecontainer( "getActivePage" )).autocomplete('clear');
            },
            minLength : 2,
            matchFromStart : false
         });
      },
      /* click auf Eintrag */
      edit : function(guid) {
         edit(guid);
      },
      /* click auf Eintrag */
      firstView : function() {
         addTasting();
      },
      getGUID : function() {
         return actWertung.guid;
      },
      setOrt : function(locObj) {
         actWertung.ort = locObj;
      }
   };
}

/** Controller aufrufen, wenn pageinit von jQM geworfen wird. */
$(document).on("pagecreate", function(event) {   // in jQM 1.4 statt pageinit neu pagecreate
   if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Event-Listener Buttons
      WhiskyApp.controller.initialize();
//      $.mobile.loadPage('#whisky-details'); Geht seit jQM 1.3.2 nicht mehr...
   }
});

