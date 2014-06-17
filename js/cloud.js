/** @module cloud */

/** Cloud: Kommunikationen mit den Whisky-Diensten */
var WhiskyCloud = Class.extend({
   // Konstruktor
   init : function() {
      this.distilleries = new Array();
      this.FBLogin = 0;

      // Facebook-Integration
      if ( typeof FB != "undefined") {
         var that = this;
         // FB Initi
         FB.init({appId: '162909123849416', status: true, cookie: true, xfbml: false});
         // Bereits angemeldet?
         FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
            } else if (response.status === 'not_authorized') {
               that.FBLogin = 1;
            } else {
               that.FBLogin = 1;
            }
         });
         FB.Event.subscribe('auth.authResponseChange',
            function(response) {
               FB.getLoginStatus(function(response) {
                  if (response.status === 'connected') {
                  } else if (response.status === 'not_authorized') {
                     that.FBLogin = 1;
                  } else {
                     that.FBLogin = 1;
                  }
               });
            }
         );
      } 
   },
   
   /** Destillerien aktualisieren? */
   checkDistilleries : function() {
      // Zeitpunkt des Updates
      var lastUpdate = localStorage.getItem('WhiskyApp.LastUpdate');
      var ldate = new Date(); //Anzahl Millisekunden seit dem 01.01.1970
      if( ldate.getTime() - lastUpdate > 604800000 ) {
         this.readDistilleries();
      } else
      {
         // Destillerien vorhanden?
         var dist = localStorage.getItem('WhiskyApp.Distilleries');
         if( dist == null ) {
            this.readDistilleries();
         }
         else {
            try {
               this.distilleries = JSON.parse(dist);
            } catch(e) {
               this.readDistilleries();
            }
         }
      }
   },
   
   /** Ermittelt anhand von Buchstaben die Distillery. AJAX-Call */
   readDistilleries : function() {
      var that = this;

      if(WhiskyApp.debug == true)
         console.log("Lesen der Destillerien");
      var server = "http://"+WhiskyApp.domain+"/getDistilleries.php";
//      var server = "http://"+WhiskyApp.domain+"/erlebnis.php";
      $.ajax({
         type: "POST",
         url: server,
         dataType: "json",
         error : function(msg, textStatus) {
            WhiskyApp.gui.alert("Fehler beim Lesen der Destillerien");
         },
         success : function(data) {
            if(data === null)
               WhiskyApp.gui.alert("Keine Daten vorhanden.");
            else
            {
               for( var i=0; i<data.length; i++ )
                  that.distilleries.push(data[i].distillery);
                  
               // Destillerien speichern
               localStorage.setItem('WhiskyApp.Distilleries', JSON.stringify(that.distilleries));
               // Zeitpunkt des Updates
               var ldate = new Date();
               localStorage.setItem('WhiskyApp.LastUpdate', ldate.getTime());
            }
         }
      });
   },
   
   /** Auf Facebook anmelden */
   loginFacebook : function() {
      var that = this;
      if( ("standalone" in window.navigator) && !window.navigator.standalone ) {
         // iOS Safari Full Screen Mode (keine Popups)
         param = {scope:'publish_actions', redirect_uri: 'http://whisky.xapps.ch', display : 'touch'}
      }
      else {
         param = {scope:'publish_actions'}
      }
      
      FB.login(function(response) { 
         if (response.authResponse) {
            that.FBLogin = 0;
         }
         else {
            WhiskyApp.gui.alert('Fehler beim Login');
         }
      }, param );
   },
   
   /** Wertung auf Facebook publizieren */
   feedOnFacebook : function(wertung) {
      if ( typeof FB != "undefined") {
         var that = this;
         if( this.FBLogin == 1 ) {
            // nicht angemeldet, also anmelden
            this.loginFacebook();
            return false;
         }
         
         // Waiting Dialog
         $.mobile.loading( 'show', {text: "sendet an Facebook...", textVisible: true} );

         // Parameter für Feed
         var params = {};
         params['message'] = 'Ich habe einen Whisky degustiert:';
         params['name'] = wertung.distillery+' '+wertung.bezeichnung;
         params['description'] = 'Kommentar: '+wertung.kommentar;
         params['link'] = 'http://www.dpunkt.de/buecher/4007/web-apps-mit-jquery-mobile.html';
         params['picture'] = 'http://'+WhiskyApp.domain+'/img/whisky.png';
         params['caption'] = wertung.wertung+' Sterne!';
         if( ("standalone" in window.navigator) && !window.navigator.standalone ) {
            // iOS Safari Full Screen Mode (keine Popups)
            params['display'] = 'touch';
            params['redirect_uri'] = 'http://whisky.xapps.ch';
         }

         FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
               $.mobile.loading( 'hide' );
               FB.api('/me/feed', 'post', params, function(response) {
                  if (!response || response.error) {
                     WhiskyApp.gui.alert('Fehler');
                  } else {
                     alert('Post ID: ' + response.id);
                  }
               }); 
            } else if (response.status === 'not_authorized') {
               $.mobile.loading( 'hide' );
               WhiskyApp.gui.alert('Erneutes Facebook-Login notwendig. Nochmals ausführen bitte.');
               that.FBLogin = 1;
            } else {
               $.mobile.loading( 'hide' );
               WhiskyApp.gui.alert('Erneutes Facebook-Login notwendig. Nochmals ausführen bitte.');
               that.FBLogin = 1;
            }
          });
      }
   },

   /** Backup */
   backup : function (username, pwd) {
      // Tasting-Objekt wird in JSON umgewandelt
      var data = JSON.stringify(WhiskyApp.tastings.getWertungen());

      // WebSocket
      var socket = new WebSocket('ws://echo.websocket.org');
      // wenn die Verbindung aufgebaut ist, dann senden 
      socket.onopen = function () {
         console.log("Sende daten...");
         socket.send(data);
      };
      // Antwort empfangen
      socket.onmessage = function (msg) {
         console.log(msg.data);
         // self.close();
      };
   },

   /** Backup */
   backupAjax : function (username, pwd) {
      // Tasting-Objekt wird in JSON umgewandelt
      var data = JSON.stringify(WhiskyApp.tastings.getWertungen());

      // Anmelde-Informationen und Daten
      WhiskyCloud = {
         userID: username,
         pwd: pwd,
         data: data
      };

      var cloudJson = JSON.stringify(WhiskyCloud);
      cloudJson = "WhiskyBackup=" + cloudJson;
      if(WhiskyApp.debug)
         console.log(cloudJson);

      // URL zusammen stellen
      var server = "http://" + WhiskyApp.domain + "/whiskybackup.php";
      // AJAX-Aufruf
      $.ajax({
         type: "POST",
         url: server,
         data: cloudJson,
         cache: false,
         datatype: "json",
         error : function(msg, textStatus) {
            WhiskyApp.gui.alert("Fehler beim Backup: "+textStatus);
         },
         success : function(data) {
            WhiskyApp.gui.alert(data);
         }
      });
   },

   /** Restore */
   restore : function (username, pwd) {
      // Tasting-Objekt wird in JSON umgewandelt
      WhiskyCloud = {
         userID: username,
         pwd: pwd,
         data: ""
      };

      var cloudJson = JSON.stringify(WhiskyCloud);
      cloudJson = "WhiskyBackup=" + cloudJson;
      if(WhiskyApp.debug)
         console.log(cloudJson);

      // URL zusammen stellen
      var server = "http://" + WhiskyApp.domain + "/whiskyrestore.php";
      // AJAX-Aufruf
      $.ajax({
         type: "POST",
         url: server,
         async: false,
         data: cloudJson,
         cache: false,
         dataType: "json",
         error : function(msg, textStatus) {
            WhiskyApp.gui.alert("Fehler beim Restore von " +server+ ": "+textStatus);
         },
         success : function(data) {
            if(WhiskyApp.debug)
               console.log(data);
            if(data === null)
               WhiskyApp.gui.alert("Ungültige BenutzerID oder Passwort!");
            else
               WhiskyApp.tastings.setWertungenWithDB(JSON.parse(data[2]));
         }
      });
   }

});
