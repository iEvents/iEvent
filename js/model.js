/** Objekt Event repräsentiert eine einzelnes 
 * erstelltes Event.
 */
var Event = Class.extend({
   init : function(eventName, description, participants, location, map, dateFrom, dateTo, time, guid) {
      // GUID als ID (somit keine Probleme bei Verteilten Einträgen)
      if(guid == null)
         this.guid = this.generateGUID();
      else
         this.guid = guid;

      // Allgemeine Parameter
      this.eventName = eventName;
      this.description = description;
      this.paraticipants = participants;
      this.location = location;
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.time = time;
   
      // Ort durch GeoLocation
      if(map == null)
         this.map = "";
      else
         this.map = map;
   },
   
   /** Gibt eine Bezeichnung des Events zurück.
    */
   getName : function() {
      return this.eventName + ": " +  this.description + " - am " + this.date;
   }
});

/** Objekt Happenings - Container für Events
 *  mit den üblichen CRUD-Funktionen.
 */
var Happenings = Observer.extend({
   init : function() {
      this._super();
      this.eventAr = new Array();
   },
   
   // Nun die CRUD Funktionen
   /** Event setzen und DB aktualisieren */
   setEventWithDB : function(array) {
      // Alle Events löschen
      for ( var i = 0; i < this.eventAr.length; i++) {
         var deleted = this.eventAr.splice(i, 1);
         //this.notify({obj: deleted[0], crud: "D"});
      }
      EventApp.db.delAll();
      
      var dt = new Date();
      dt.setTime(dt.getTime() + 1000);
      while (new Date().getTime() < dt.getTime());
      
      // Event hinzufügen
      for ( var i = 0; i < array.length; i++) {
         this.add(array[i]);
      }
   },
   
   /** Events setzen */
   setEvents : function(array) {
      this.eventAr = array;

      // update
      this.notify({obj: this.eventAr, crud: "R"});
   },
   
   /** (C) Erzeugt ein Event und fügt diese hinzu.
    */
   create : function(eventName, description, participants, location, map, date, time) {
   
      // Event erzeugen
   	var event = new Event(eventName, description, participants, location, map, date, time);
   
      // dem Array hinzufügen      
      this.eventAr.push(event);

      // update
      this.notify({obj: event, crud: "C"});
   },
   
   /** (C) Fügt einen Eintrag hinzu, mit Event-Objekt
    */
   add : function(event) {
         // dem Array hinzufügen      
      this.eventAr.push(event);

      // update
      this.notify({obj: event, crud: "C"});
   },
   
   /** (R) Sucht den Event mit der GUID.
    */
   getEventByID : function(guid) {
   	for ( var i = 0; i < this.eventAr.length; i++) {
   		if (this.eventAr[i].guid == guid) {
   			return this.eventAr[i];
   		}
   	}
   },
   
   /** (R) Array mit Events zurückgeben
    */
   getEvents : function() {
      return this.eventAr;
   },
   
   /** (U) Aktualisiert den Event.
    * Wenn diese nicht vorhanden ist, wird eine neue erzeugt.
    */
   edit : function(event) {
      var gefunden = 0;
      
      for ( var i = 0; i < this.eventAr.length; i++) {
         if (this.eventAr[i].guid == event.guid) {
            // Event gefunden, nun ersetzen
            this.eventAr[i] = event;
            gefunden = 1;
            this.notify({obj: event, crud: "U"});
         }
      }
      
      // existiert keine, dann hinzufügen
      if( gefunden == 0 )
         this.add(event);
   },

   /** (D) Löscht den Event mit der GUID.
    */
   deleteID : function(guid) {
   	for ( var i = 0; i < this.eventAr.length; i++) {
   		if (this.eventAr[i].guid == guid) {
   			var deleted = this.eventAr.splice(i, 1);
            this.notify({obj: deleted[0], crud: "D"});
   			return;
   		}
   	}
   }
});
