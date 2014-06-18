/** @module controller */

/** Controller */
var EventAppController = function() {
	/** @lends EventAppController */
	var actEvent;
	// Aktuell bearbeitetes Event
	// var valid = new Validator();

	/** Zurück auf Home.
	 * Quelle: event-details
	 * Ziel: event-home */
	function home() {
		if (EventApp.tablet == true) {
			$('#delDialog').popup('close');
			// Einfach schliessen, auch wenn nicht offen
			addHappening();
		} else
			//$.mobile.changePage("#whisky-home", {
			$("body").pagecontainer("change", "#event-home");
	}

	/** Neues Event erstellen.
	 * Quelle: event-home
	 * Ziel: event-details */
	function addHappening() {
		$.mobile.silentScroll();

		// Datum ermitteln, leider muss das ganz genau stimmen
		// var ldate = new Date();
		// var disp_date = "";
		// if ((ldate.getMonth() + 1) < 10) {
		// if (ldate.getDate() < 10)
		// disp_date = "0" + ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		// else
		// disp_date = ldate.getDate() + ".0" + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		// } else {
		// if (ldate.getDate() < 10)
		// disp_date = "0" + ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		// else
		// disp_date = ldate.getDate() + "." + (ldate.getMonth() + 1) + "." + ldate.getFullYear();
		// }

		// Neues Event mit Default-Werten löschen
		actEvent = new Event("Nachttreffen", "bringt Kuchen mit", "noch keiner", "zu Hause", "", "21.6.2014", "16:00", "2", "");

		// und so tun, als ob es eine gäbe...
		// edit();

		// EventApp.locAPI.start(actEvent.guid);

		// erstmalige Validierung
		// valid.validate();
	}

	/** Event darstellen zum editieren
	 * Quelle: event-home
	 * Ziel: event-details */
	function edit(guid) {
		$.mobile.silentScroll();

		alert("asdf");

		// aktuelles Event merken
		if (guid != undefined)
			actEvent = EventApp.happenings.getEventByID(guid);

		// Page wechseln
		if (EventApp.tablet == false)
			$("body").pagecontainer("change", "#event-details");

		// Werte setzen
		// refreshEvent();
		// valid.validate();
		//
		// addSliderEvents();
		// plotUpdate();

	}

	// /** Event löschen.
	// * Quelle: event-details
	// * Ziel: event-home */
	// function deleteEvent() {
	// if (actEvent != null)
	// EventApp.happenings.deleteID(actEvent.guid);
	//
	// if (EventApp.tablet == true)
	// addHappening();
	//
	// //      $.mobile.changePage("#event-home", {
	// $("body").pagecontainer("change", "#event-home", {// geändert in jQM 1.4
	// transition : "none"
	// });
	// }
	//
	/** Event speichern.
	 * Quelle: event-details
	 * Ziel: event-home */
	function saveEvent() {
		var e;

		alert($('#eventname', $("body").pagecontainer("getActivePage")).val() + $('#description', $("body").pagecontainer("getActivePage")).val() +
		// e.participants = $('#participants', $("body").pagecontainer("getActivePage")).val();
		$('#location', $("body").pagecontainer("getActivePage")).val() + $('#dateFrom', $("body").pagecontainer("getActivePage")).val() + $('#dateTo', $("body").pagecontainer("getActivePage")).val());

		// Event hinzufügen
		if (actEvent == null)
			e = new Event();
		else// Wertung updaten
			e = actEvent;

		// validierung
		// if (valid.validate() == false)
		// return false;

		// Felder holen
		e.eventName = $('#eventname', $("body").pagecontainer("getActivePage")).val();
		e.description = $('#description', $("body").pagecontainer("getActivePage")).val();
		// e.participants = $('#participants', $("body").pagecontainer("getActivePage")).val();
		e.location = $('#location', $("body").pagecontainer("getActivePage")).val();
		e.dateFrom = $('#dateFrom', $("body").pagecontainer("getActivePage")).val();
		e.dateTo = $('#dateTo', $("body").pagecontainer("getActivePage")).val();

		// Eintrag hinzufügen/erzeugen (wird in Methode entschieden)
		EventApp.happenings.edit(e);

		if (EventApp.tablet == false)
			//         $.mobile.changePage("#event-home", {
			$("body").pagecontainer("change", "#event-home");
		else
			addHappening();
	}

	// /** Aktualisiert Events-Page
	// */
	// function refreshEvent() {
	// // Zuweisungen
	// $('#date', $("body").pagecontainer("getActivePage")).val(actWertung.date);
	// $('#distillery', $("body").pagecontainer("getActivePage")).val(actWertung.distillery);
	// $('#bezeichnung', $("body").pagecontainer("getActivePage")).val(actWertung.bezeichnung);
	// $('#fass', $("body").pagecontainer("getActivePage")).val(actWertung.fass).selectmenu("refresh");
	// $('#proof', $("body").pagecontainer("getActivePage")).val(actWertung.proof).flipswitch("refresh");
	// // new in jQM 1.4
	// $('#finishing', $("body").pagecontainer("getActivePage")).val(actWertung.finishing).flipswitch("refresh");
	// // new in jQM 1.4
	// //$('#probennr', $( "body" ).pagecontainer( "getActivePage" )).val(actWertung.nr);
	// if (actWertung.nr.length > 0)
	// $('#bildView').attr('src', actWertung.nr);
	// else
	// $('#bildView').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
	// $('#wertung', $("body").pagecontainer("getActivePage")).rating('select', actWertung.wertung - 1);
	// $('#torf', $("body").pagecontainer("getActivePage")).val(actWertung.gtorf).slider("refresh");
	// $('#sherry', $("body").pagecontainer("getActivePage")).val(actWertung.gsherry).slider("refresh");
	// $('#holz', $("body").pagecontainer("getActivePage")).val(actWertung.gholz).slider("refresh");
	// $('#frucht', $("body").pagecontainer("getActivePage")).val(actWertung.gfrucht).slider("refresh");
	// $('#flora', $("body").pagecontainer("getActivePage")).val(actWertung.gflora).slider("refresh");
	// $('#feinty', $("body").pagecontainer("getActivePage")).val(actWertung.gfeinty).slider("refresh");
	// $('#finish', $("body").pagecontainer("getActivePage")).val(actWertung.finish).selectmenu("refresh");
	// $('#kommentar', $("body").pagecontainer("getActivePage")).val(actWertung.kommentar);
	//
	// var map = actEvent.map;
	// if (ort == "") {
	// $('#adresse', $("body").pagecontainer("getActivePage")).text("");
	// $('#adrimg', $("body").pagecontainer("getActivePage")).remove();
	// } else {
	// EventApp.gui.setLocation(ort);
	// }
	// }
	//
	// /** Plot aktualisieren */
	// function plotUpdate() {
	// var options = {
	// series : {
	// stack : 0,
	// lines : {
	// show : false,
	// steps : false
	// },
	// bars : {
	// show : true,
	// barWidth : 0.9,
	// align : 'center'
	// }
	// },
	// xaxis : {
	// ticks : [[1, 'Torf'], [2, 'Sherry'], [3, 'Holz'], [4, 'Frucht'], [5, 'Flora'], [6, 'Feinty']]
	// },
	// yaxis : {
	// min : 0,
	// max : 6
	// }
	// };
	//
	// if ($('#name', $("body").pagecontainer("getActivePage")).val() != "") {
	// var data = [{
	// label : "Wertung",
	// data : [[1, $('#torf', $("body").pagecontainer("getActivePage")).val()], [2, $('#sherry', $("body").pagecontainer("getActivePage")).val()], [3, $('#holz', $("body").pagecontainer("getActivePage")).val()], [4, $('#frucht', $("body").pagecontainer("getActivePage")).val()], [5, $('#flora', $("body").pagecontainer("getActivePage")).val()], [6, $('#feinty', $("body").pagecontainer("getActivePage")).val()]]
	// }];
	// } else {
	// var data = [{
	// label : "Wertung",
	// data : [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]]
	// }];
	// }
	// $.plot($("#chart", $("body").pagecontainer("getActivePage")), data, options);
	// }
	//
	// /** Slider-Events registrieren */
	// function addSliderEvents() {
	// // Slider-Events registrieren
	// $('#torf', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// $('#sherry', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// $('#holz', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// $('#frucht', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// $('#flora', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// $('#feinty', $("body").pagecontainer("getActivePage")).bind('change', function(event) {
	// event.preventDefault();
	// plotUpdate();
	// return false;
	// });
	// }
	//
	// /** Facebook-Veröffentlichung */
	// function toFacebook() {
	// var w = actWertung;
	// w.distillery = $('#distillery', $("body").pagecontainer("getActivePage")).val();
	// w.bezeichnung = $('#bezeichnung', $("body").pagecontainer("getActivePage")).val();
	// w.wertung = $("input:radio:checked[name='wertung']", $("body").pagecontainer("getActivePage")).val();
	// w.kommentar = $('#kommentar', $("body").pagecontainer("getActivePage")).val();
	// WhiskyApp.cloud.feedOnFacebook(w);
	// }
	//
	// /** Backup / Restore Dialog
	// * Quelle: whisky-home
	// * Ziel: whisky-sync */
	// function backupdialog() {
	// $('#username').val(localStorage.getItem('WhiskyCloud_BenutzerName'));
	// $("body").pagecontainer("change", "#whisky-sync", {// geändert in jQM 1.4
	// transition : "none"
	// });
	// }
	//
	// /** Backup
	// * Quelle: whisky-sync
	// * Ziel: whisky-home */
	// function backup() {
	// if ($('#pwd').val() !== "" && $('#username').val() !== "") {
	// localStorage.setItem('WhiskyCloud_BenutzerName', $('#username').val());
	// WhiskyApp.cloud.backup($('#username').val(), $('#pwd').val());
	// //         $.mobile.changePage("#whisky-home", {
	// $("body").pagecontainer("change", "#whisky-home", {// geändert in jQM 1.4
	// transition : "none"
	// });
	// }
	// }
	//
	// /** Restore
	// * Quelle: whisky-sync
	// * Ziel: whisky-home */
	// function restore() {
	// if ($('#pwd').val() !== "" && $('#username').val() !== "") {
	// localStorage.setItem('WhiskyCloud_BenutzerName', $('#username').val());
	// WhiskyApp.cloud.restore($('#username').val(), $('#pwd').val());
	// //         $.mobile.changePage("#whisky-home", {
	// $("body").pagecontainer("change", "#whisky-home", {// geändert in jQM 1.4
	// transition : "none"
	// });
	// }
	// }
	//
	// /** Liest das Bild ein und stellt es dar */
	// function handleFileSelect(evt) {
	// if ( typeof FileReader == "undefined")
	// return true;
	//
	// var file = evt.target.files[0];
	// // Nur eine Auswahl
	// var elem = $(this);
	//
	// if (file.type.match('image.*')) {
	// var reader = new FileReader();
	// reader.onload = (function(theFile) {
	// return function(e) {
	// var image = e.target.result;
	// $('#bildView').attr('src', image);
	// };
	// })(file);
	// reader.readAsDataURL(file);
	// }
	// }

	/** Init */
	return {
		initialize : function() {

			// Refresh-Button
			$("#refresh").click(function() {
				location.reload(true);
			});

			// Add-Button in der Liste
			$("#add").bind('vclick', function(event) {
				event.preventDefault();
				addHappening();
				return false;
			});

			// Home-Button
			$("#home").click(home);

			// Delete-Button
			$("#delEvent").click(function() {
				$('#delDialog').popup('open')
			});
			$("#delRealy").click(function(event) {
				event.preventDefault();
				// deleteEvent();
				console.log('Event wurde gelöscht');
				return false;
			});
			$("#delNo").click(function() {
				$('#delDialog').popup('close')
			});

			// Save-Button
			$("#saveEvent").bind('vclick', function(event) {
				event.preventDefault();
				saveEvent();
				return false;
			});

			// // Live-Validierung
			// valid.autoValidate();
			//
			// // Facebook
			// $("#facebook").click(toFacebook);

		}
		// ,
		// /* click auf Eintrag */
		// edit : function(guid) {
		// edit(guid);
		// },
		// /* click auf Eintrag */
		// firstView : function() {
		// // addTasting();
		// },
		// getGUID : function() {
		// // return actWertung.guid;
		// },
		// setMap : function(locObj) {
		// // actWertung.ort = locObj;
		// }
	};
}
/** Controller aufrufen, wenn pageinit von jQM geworfen wird. */
$(document).on("pagecreate", function(event) {// in jQM 1.4 statt pageinit neu pagecreate
	if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined')) {// Event-Listener Buttons
		EventApp.controller.initialize();
	}
});

