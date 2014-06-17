/** @module database/websql */

/** Whisky-DB-Zugriff */
var WhiskyDB = Class.extend({
   init : function() {
      this.shortName = 'Whisky';
      this.displayName = "Whisky Rating App";
      this.version = "1.0";
      this.maxSize = 1048576; // 1 MB

      console.log("WebSQL");

   	try {
   		this.db = openDatabase(this.shortName, this.version, this.displayName, this.maxSize);
   		this.createDB();
   	}
   	catch(e) {
         if (e == 2) 
   	      alert("Invalid database version.");
   		else
   	      alert("Unknown error "+e+".");
   	}
   },

   /** Fehler-Handling, statische Methode! */
   errorHandler : function(transaction, error) {
      WhiskyApp.gui.alert('Fehler: ' + error.message + '(' + error.code + ')');
	   return true;
   },

   /** Fehler-Handling, statische Methode! */
   trErrorHandler : function(transaction) {
      WhiskyApp.gui.alert('trErrorHandler: ' + transaction.message );
      return true; //true = roll back transaction, false = execution continues
   },

   /** CREATE Table */
   createDB : function() {
   	this.db.transaction(
   		function(transaction) {
   			transaction.executeSql(
   			'CREATE TABLE IF NOT EXISTS wertungen ' +
   			' (guid TEXT NOT NULL PRIMARY KEY, ' +
   			'  date DATE NOT NULL, ' +
   			'  distillery TEXT NOT NULL, ' +
   			'  bezeichnung TEXT, ' +
   			'  fass TEXT, ' +
   			'  proof TEXT, ' +
            '  finishing TEXT, ' +
   			'  probennr INTEGER, ' +
   			'  wertung INTEGER, ' +
   			'  gtorf INTEGER, ' +
   			'  gsherry INTEGER, ' +
   			'  gholz INTEGER, ' +
   			'  gfrucht INTEGER, ' +
   			'  gflora INTEGER, ' +
   			'  gfeinty INTEGER, ' +
   			'  finish INTEGER, ' +
   			'  kommentar TEXT, ' +
   			'  ort TEXT );', [], function(){}, WhiskyApp.db.errorHandler );
   		}
   	);
   },

   /** Alle wertung lesen */
   readWertungen : function() {
      var array = new Array();
      this.db.transaction( function(transaction) {
         transaction.executeSql( 'SELECT * FROM wertungen ORDER BY distillery;',[] , 
         function (transaction, result) {
            for (var i=0; i < result.rows.length; i++) {
               var row = result.rows.item(i);
               var ort = "";
               // Wertung erzeugen
               try {
                  ort = JSON.parse(row.ort);   
               } catch(e) {}
               var wertung = new Wertung(row.date, row.distillery, row.bezeichnung, row.fass, row.proof, row.finishing, row.probennr, row.wertung, row.gtorf, row.gsherry, row.gholz, row.gfrucht, row.gflora, row.gfeinty, row.finish, row.kommentar, ort, row.guid);
               array.push(wertung);
            }
            // Alle Wertungen dem Modell übergeben
            WhiskyApp.tastings.setWertungen(array);
         }, WhiskyApp.db.errorHandler );
      }, WhiskyApp.db.trErrorHandler );
   },

   /** INSERT */
   insertEntry : function(wertung) {
      // Ort in der DB als JSON Objekt
      var ort = "";
      try {
         ort = JSON.stringify(wertung.ort);
      } catch(e) {}
 
      this.db.transaction( function(transaction) {
         transaction.executeSql(
                   'INSERT INTO wertungen (guid, date, distillery, bezeichnung, fass, proof, finishing, probennr, wertung, gtorf, gsherry, gholz, gfrucht, gflora, gfeinty, finish, kommentar, ort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
                   [wertung.guid, wertung.date, wertung.distillery, wertung.bezeichnung, wertung.fass, wertung.proof, wertung.finishing, wertung.nr, wertung.wertung, wertung.gtorf, wertung.gsherry, wertung.gholz, wertung.gfrucht, wertung.gflora, wertung.gfeinty, wertung.finish, wertung.kommentar, ort],
                   function(){ }, WhiskyApp.db.errorHandler );
      }, WhiskyApp.db.trErrorHandler );
   },

   /** DELETE einer einzelnen Wertung */
   delEntry : function(guid) {
      this.db.transaction( function(transaction) {
         transaction.executeSql('DELETE FROM wertungen WHERE guid=?;', [guid], function() { }, WhiskyApp.db.errorHandler);
      }, WhiskyApp.db.trErrorHandler );
   },

   /** Ganzer Tabellen-Inhalt löschen */
   delAll : function() {
      this.db.transaction( function(transaction) {
         transaction.executeSql( 'DELETE FROM wertungen;', [], function(){}, WhiskyApp.db.errorHandler );
      });
   },

   /** EDIT */
   editEntry : function(wertung) {
      this.db.transaction( function(transaction) {
         transaction.executeSql('UPDATE wertungen SET date=?, distillery=?, bezeichnung=?, fass=?, proof=?, finishing=?, probennr=?, wertung=?, gtorf=?, gsherry=?, gholz=?, gfrucht=?, gflora=?, gfeinty=?, finish=?, kommentar=? WHERE guid=?;', 
         [wertung.date, wertung.distillery, wertung.bezeichnung, wertung.fass, wertung.proof, wertung.finishing, wertung.nr, wertung.wertung, wertung.gtorf, wertung.gsherry, wertung.gholz, wertung.gfrucht, wertung.gflora, wertung.gfeinty, wertung.finish, wertung.kommentar, wertung.guid], function(){}, WhiskyApp.db.errorHandler);
      }, WhiskyApp.db.trErrorHandler );
   },

   /** DB aktualisieren */
   update : function(scope, data) {
      switch(data.crud) {  // bei R nichts machen
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