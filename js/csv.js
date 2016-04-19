var THIRTY_SEC_LOC = [];
var BACKGROUND_LOC = [];
var GEOFENCE_LOC = [];


$(function(){
	$('#csvFile').change(function (event) {
		
		if(event.target.files[0].type != "application/vnd.ms-excel"){
			alert(Messages.NOT_A_CSV);
			return;
		}
			
		var fileUrl = URL.createObjectURL(event.target.files[0]);
		var pattern = /(?:Latitude|Longitude|Accuracy|GeofenceSystem-id).+?([\d\.]+)/gi

		$.get(fileUrl, function (data) {
			var columns  = data.split("\n");
			var i;
			for(i = 1; i < columns.length; i++){
				if( (columns[i]!=undefined && columns[i].indexOf('GeofenceSystem-Id') > 0)){
					GEOFENCE_LOC.push(columns[i].match(pattern).toString().split(/[ :,]+/));
				}else if( columns[i]!=undefined && columns[i].indexOf("Location(30 Sec) GPS") > 0 ){
					THIRTY_SEC_LOC.push(columns[i].match(pattern).toString().split(/[ :,]+/));
				}else if( columns[i]!=undefined && columns[i].indexOf("LocationFUSED") > 0 ||  columns[i].indexOf("LocationGPS") > 0 ){
					BACKGROUND_LOC.push(columns[i].match(pattern).toString().split(/[ :,]+/));
				}
			}			
			
			createGeofenceCircle(GEOFENCE_LOC);
			createBGLocationCircle(BACKGROUND_LOC);
			createThirtyLocationCircle(THIRTY_SEC_LOC);
		});
	});
});

function goFullScreen(){
	var elem = document.getElementById('map_canvas');
	if (document.webkitFullscreenElement) {
		document.webkitCancelFullScreen();
	} else {
		elem.webkitRequestFullScreen();
	}
}

function createBGLocationCircle(locationColumns){
	$('#locations').text(locationColumns.length);

	for(var j = 0; j < locationColumns.length; j++){
		$("#BG_TOGGLE").prop("checked", true);
		var column = locationColumns[j];
		var lat = column[1];
		var lng = column[3];
		var acc = column[5];
		var lt = new google.maps.LatLng(lat, lng);
		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#02BCFA",
			fillColor: "#B3EAFC",
			fillOpacity: 0.4,
			accuracy : acc,
			map: map,
			center: lt,
		});
	
		var obj={Circle: b, data:lt, Type:"BG"}
		createCircleWithOptions(map, obj, "BL", parseInt(acc) );
		//createCircleWithOptions(map, lt, "BL", 10 );
	}
}

function createThirtyLocationCircle(locationColumns){
	$('#thirtySec').text(locationColumns.length);

	for(var j = 0; j < locationColumns.length; j++){
		$("#THIRTY_TOGGLE").prop("checked", true);
		var column = locationColumns[j];
		var lat = column[1];
		var lng = column[3];
		var acc = column[5];
		var lt = new google.maps.LatLng(lat, lng);

		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#FAD502",
			fillColor: "#FAF2C8",
			fillOpacity: 0.4,
			accuracy : acc,
			map: map,
			center: lt,
		});
	
		var obj={Circle: b, data:lt, Type:"3G"}
		createCircleWithOptions(map, obj, "30sec", b );
	}
}

function createGeofenceCircle(geofenceColumns){
	$('#breaches').text(geofenceColumns.length);
	
	for(var j = 0; j < geofenceColumns.length; j++){
		$("#GEOFENCE_TOGGLE").prop("checked", true);	
		var column = geofenceColumns[j];
		var lat,lng,geofenceId;
		var acc;
		var lt;
		
		geofenceId = column[1];
		lat = column[3];
		lng = column[5];
		acc = column[7];
		lt = new google.maps.LatLng(lat, lng);

		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#FF0000",
			fillColor: "#FFE3E3",
			fillOpacity: 0.4,
			accuracy : acc,
			map: map,
			center: lt,
		});
	
		var obj={Circle: b, data:lt, Type:"G"}
		createCircleWithOptions(map, obj, "Geofence " + geofenceId, b );
		
	
	}
}

