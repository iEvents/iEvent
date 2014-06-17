/** @module database/indexedb */

/** Whisky-DB-Zugriff
 */
var WhiskyDB = Class.extend({
   init : function() {
      this.shortName = 'Whisky';
      this.store = "wertungen";
      this.version = 8; // IE will reine Zahl

      console.log("Indexed DB");

      if ('webkitIndexedDB' in window) {
         window.IDBTransaction = window.webkitIDBTransaction;
         window.IDBKeyRange = window.webkitIDBKeyRange;
      }

      this.indexedDB = {};
      this.indexedDB.db = null;
      this.indexedDB.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
      if (!this.indexedDB.indexedDB)
         alert("Dieser Browser wird nicht unterstützt!. Versuchen Sie einen WebKit-Browser.")

      this.indexedDB.onerror = function(e) {
         WhiskyApp.gui.alert(e.massage);
      };
   },

   /** Alle wertung lesen */
   readWertungen : function() {
      // db öffnen
      var request = this.indexedDB.indexedDB.open(this.shortName, this.version);
      request.onsuccess = function(evt) {
         WhiskyApp.db.indexedDB.db = this.result;
         WhiskyApp.db.readObj();
      };

      request.onerror = function(evt) {
         alert("IndexedDB error: " + evt.target.errorCode);
      };

      // wenn Version nicht mehrstimmt oder die DB
      // nicht vorhanden ist, dann Objekt erzeugen
      request.onupgradeneeded = function(evt) {
         WhiskyApp.db.indexedDB.db = evt.target.result;
         store = WhiskyApp.db.indexedDB.db.createObjectStore(WhiskyApp.db.store, {keyPath: 'key', autoIncrement: true});
      };
   },

   /** Alle wertung lesen */
   readObj : function() {
      var array = new Array();
      var db = this.indexedDB.db;
      var trans = db.transaction([this.store], "readwrite");
      var store = trans.objectStore(this.store);

      // Alle Wertungen lesen
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      cursorRequest.onsuccess = function(e) {
         var result = cursorRequest.result || e.result;

         if (result == undefined) {
            WhiskyApp.tastings.setWertungen(array);
         } else {
            array.push(result.value.data);
            result.
            continue();
         }
      };

      cursorRequest.onerror = this.indexedDB.onerror;
   },

   /** INSERT */
   insertEntry : function(wertung) {
      var db = this.indexedDB.db;
      var trans = db.transaction([this.store], "readwrite");
      var store = trans.objectStore(this.store);

      var data = {
         "guid" : wertung.guid,
         "data" : wertung
      };

      var request = store.put(data);

      request.onerror = function(e) {
         WhiskyApp.db.errorHandler(e);
      };
   },

   /** DELETE */
   delEntry : function(guid) {
      var db = this.indexedDB.db;
      var trans = db.transaction([this.store], "readwrite");
      var store = trans.objectStore(this.store);
      var request = store.
      delete (guid);
      request.onsuccess = function(evt) {
      };
   },

   /** EDIT */
   editEntry : function(wertung) {
      // entspricht dem insert
      this.insertEntry(wertung);
   },

   /** DB aktualisieren */
   update : function(scope, data) {
      switch(data.crud) {// bei R nichts machen
         case 'C':
            this.insertEntry(data.obj);
            break;
         case 'U':
            this.editEntry(data.obj);
            break;
         case 'D':
            this.delEntry(data.obj.guid);
            break;
      }
   }
});
