/** @module location */

/** LOCATION API */
var Location = Observer.extend({
   init : function() {
      this._super();
      this.guid = "";
      this.locObj = {};
      this.locObj.adresse = "";
      this.locObj.pos = "";
      this.locObj.altitude = "";
      this.locObj.state = "";
      this.locObj.string = "";
   },

   /** Startet eine Ermittlung erneut. */
   start : function(guid) {
      var that = this;
      that.guid = guid; // Die aktuelle GUID der Wertung - Pos. gilt nur für diese!
      
      var options = {
         maximumAge : 30000 // max. Alter der Position in ms
      };
      this.locObj.state = "Position ermitteln....";
      navigator.geolocation.getCurrentPosition(function(position) {
         that.setPosition(position);
      }, function(error) {
         that.doError(error);
      }, options);
   },
   
   /** Setzt die aktuelle Position (Koordinaten) und ermittelt dazu die Adresse. */
   setPosition : function(position) {
      this.locObj.pos = position.coords.latitude + "," + position.coords.longitude;
      this.locObj.altitude = position.coords.altitude;
      this.notify();

      if ( typeof google != "undefined") {
         var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         var geocoder = new google.maps.Geocoder();
         var that = this;

         geocoder.geocode({
            'latLng' : latlng
         }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
               if (results[0]) {
                  that.locObj.adresse = results[0].formatted_address;
                  that.notify();
               }
            }
         });
      }
   },

   /** Gibt die GUID der Wertung zurück */
   getGUID : function() {
      return this.guid;
   },

   /** Gibt das LocObj zurück. */
   getLocObj : function() {
      this.locObj.string = this.getString();
      return this.locObj;
   },

   /** Gibt die ermittelte Adresse zurück, wenn vorhanden. Sonst die Koordianten und
    * wenn diese auch nicht vorhanden sind dann den Status. */
   getString : function() {
      if (this.locObj.adresse == "") { // keine Adresse
         if (this.locObj.pos == "")
            return this.locObj.state;
         else {
            if (this.altitude != null)
               return Math.round(this.locObj.altitude * 10) / 10 + "m";
            else
               return this.locObj.pos;
         }
      } else {
         if (this.altitude != null)
            return this.locObj.adresse + " - " + Math.round(this.locObj.altitude * 10) / 10 + "m";
         else
            return this.locObj.adresse;
      }
   },

   /** Fehler der Ermittlung. */
   doError : function(error) {
      switch (error.code) {
         case error.PERMISSION_DENIED:
            this.locObj.state = "Sie haben keine Berechtigung für GEO-Location gegeben.";
            break;

         case error.POSITION_UNAVAILABLE:
            this.locObj.state = "Kann aktuelle Position nicht finden.";
            break;

         case error.TIMEOUT:
            this.locObj.state = "Time-Out";
            break;

         default:
            this.locObj.state = "Unbekannter Fehler";
            break;
      }

      // Im Debug-Modus ausgeben, sonst Pech gehabt
      if (EventApp.debug)
         console.log(this.locObj.state);
   }
});
