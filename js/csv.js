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
			var geofenceColumns = [];
			
			var locationColumns = [];
		
			for(var i = 1; i < columns.length; i++){
				if( (columns[i].search('GeofenceSystem-Id') > 0) || 
						(columns[i].search('Is-Submitted:Submitted') > 0) ){
							geofenceColumns.push(columns[i].match(pattern).toString().split(/[ :,]+/));
				}
			}			
			createGeofenceCircle(geofenceColumns);
			
			for(var j = 1; j <= columns.length; j++){
				if( columns[j]!=undefined && columns[j].search("Latitude") > 0 ){
						locationColumns.push(columns[j].match(pattern).toString().split(/[ :,]+/));
				}
			}
			//console.log(locationColumns);
			createLocationCircle(locationColumns);
			
		
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

function createLocationCircle(locationColumns){
	$('#locations').text(locationColumns.length);

	for(var j = 0; j < locationColumns.length; j++){

		var column = locationColumns[j];

		var lat = column[1];
		var lng = column[3];
		var acc = column[5];
		var lt = new google.maps.LatLng(lat, lng);

		createCircleWithOptions(map, lt, "BL", parseInt(acc) );
		//createCircleWithOptions(map, lt, "BL", 10 );
	}
}

function createGeofenceCircle(geofenceColumns){
	$('#breaches').text(geofenceColumns.length);

	for(var j = 0; j < geofenceColumns.length; j++){
		
		var column = geofenceColumns[j];
		var lat,lng,geofenceId;
		var acc;
		var lt;
		
		geofenceId = column[1];
		lat = column[3];
		lng = column[5];
		acc = column[7];
		lt = new google.maps.LatLng(lat, lng);
		
		console.log(acc);
		var b = new google.maps.Circle({
			strokeWeight: 1,
			strokeColor: "#FF0000",
			fillColor: "#FFE3E3",
			fillOpacity: 0.4,
			accuracy : acc
		});
	
		createCircleWithOptions(map, lt, "Geofence " + geofenceId, b );
	
	}
}
