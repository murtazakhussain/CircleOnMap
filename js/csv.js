var THIRTY_SEC_LOC = [];
var BACKGROUND_LOC = [];
var GEOFENCE_LOC = [];
var pattern = /(?:Latitude|Longitude|Accuracy|GeofenceSystem-id).+?([\d\.]+)/gi

$(function(){
	$('#csvFile').change(function (event) {
		
		if(event.target.files[0].type != "application/vnd.ms-excel"){
			alert(Messages.NOT_A_CSV);
			return;
		}
			
		var fileUrl = URL.createObjectURL(event.target.files[0]);
		
		$.get(fileUrl, function (data) {
			var columns  = data.split("\n");
			var i;
			for(i = 1; i < columns.length; i++){
				if( (columns[i]!=undefined && columns[i].indexOf('GeofenceSystem-Id') > 0)){
					GEOFENCE_LOC.push(parseIntoLocationObj(columns[i]));
				}else if( columns[i]!=undefined && columns[i].indexOf("Location(30 Sec) GPS") > 0 ){
					THIRTY_SEC_LOC.push(parseIntoLocationObj(columns[i]));
				}else if( columns[i]!=undefined && columns[i].indexOf("LocationFUSED") > 0 ||  
						columns[i].indexOf("LocationGPS") > 0 ){
					BACKGROUND_LOC.push(parseIntoLocationObj(columns[i]));
				}else if( columns[i]!=undefined && columns[i].indexOf("Current Location") > 0 ){
					BACKGROUND_LOC.push(parseIntoLocationObj(columns[i]));
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
		var realObj = new generateRealObject(locationColumns[j], "BG");
		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#02BCFA",
			fillColor: "#B3EAFC",
			fillOpacity: 0.4,
			accuracy : realObj.Accuracy,
			map: map,
			center: realObj.getGoogleLatLng(),
		});
		var obj={Circle: b, data:realObj.getGoogleLatLng(), Type:"BG"}
		createCircleWithOptions(map, obj, "BG", b );
	}
}

function createThirtyLocationCircle(locationColumns){
	$('#thirtySec').text(locationColumns.length);

	for(var j = 0; j < locationColumns.length; j++){
		$("#THIRTY_TOGGLE").prop("checked", true);
		var realObj = new generateRealObject(locationColumns[j], "3G");
		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#FAD502",
			fillColor: "#FAF2C8",
			fillOpacity: 0.4,
			accuracy : realObj.Accuracy,
			map: map,
			center: realObj.getGoogleLatLng(),
		});
	
		var obj={Circle: b, data:realObj.getGoogleLatLng(), Type:"3G"}
		createCircleWithOptions(map, obj, "30sec", b );
	}
}

function createGeofenceCircle(geofenceColumns){
	$('#breaches').text(geofenceColumns.length);
	
	for(var j = 0; j < geofenceColumns.length; j++){
		$("#GEOFENCE_TOGGLE").prop("checked", true);	
		var realObj = new generateRealObject(geofenceColumns[j], "G");
		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#FF0000",
			fillColor: "#FFE3E3",
			fillOpacity: 0.4,
			accuracy : realObj.Accuracy,
			map: map,
			center: realObj.getGoogleLatLng(),
		});
	
		var obj={Circle: b, data:realObj.getGoogleLatLng(), Type:"G"}
		createCircleWithOptions(map, obj, "Geofence " + realObj.GeofenceId, b );
		
	
	}
}

function bulkDraw(){
	var values  = $('#txtBulk').val().split('\n');

	for(var j = 0; j < values.length; j++){
		$("#BG_TOGGLE").prop("checked", true);
		locationColumns = parseIntoLocationObj(values[j]);
		
		if(locationColumns != "undefined"){
			var column = locationColumns;
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
		}
	}
	$('#txtBulk').val("");
	
}

function parseIntoLocationObj(val){
	try {
		return val.match(pattern).toString().split(/[ :,]+/)
	}
	catch(err) {
		console.error(err);
		return "undefined";
	}
}

function generateRealObject(obj, type){

	if(type == "GEOFENCE" || type == "G"){
		this.Type = type;
		try{
			this.GeofenceId = obj[1];
		}catch(err) {
			this.GeofenceId = 0;
		}
		this.Latitude = obj[3];
		this.Longitude = obj[5];
		this.Accuracy = obj[7];
	}else{
		this.Latitude = obj[1];
		this.Longitude = obj[3];
		this.Accuracy = obj[5];
	}
	this.getGoogleLatLng = function(){
		return new google.maps.LatLng(this.Latitude, this.Longitude);
	};
	
}
