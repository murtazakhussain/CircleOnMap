$(function(){
	$('#csvFile').change(function (event) {
		
		if(event.target.files[0].type != "application/vnd.ms-excel"){
			alert(Messages.NOT_A_CSV);
			return;
		}
			
		var fileUrl = URL.createObjectURL(event.target.files[0]);

		$.get(fileUrl, function (data) {
			var columns  = data.split("\n");
			var geofenceColumns = [];
			
			var locationColumns = [];
		
			for(var i = 1; i < columns.length; i++){
				if( (columns[i].search('GeofenceSystem-Id') > 0) || 
						(columns[i].search('Is-Submitted:Submitted') > 0) ){
					geofenceColumns.push(columns[i].split(/[ :,]+/));
				}
			}			
			console.log(geofenceColumns);
			createGeofenceCircle(geofenceColumns);
			
			for(var j = 1; j <= columns.length; j++){
				if( columns[j]!=undefined && columns[j].search("Latitude") > 0 ){
						locationColumns.push(columns[j].split(" "));
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
		var acc = column[5].split("\",\"")[0];
		//console.log(lat + " " + lng + " " + acc);

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
/*		try {
			lat = column[16];
			lng = column[18];
			acc = column[20];
			geofenceId = column[4];
			console.log(lat + " " + lng + " " + acc);

		}
		catch(err) {
			console.log(err);*/
			lat = column[22];
			lng = column[24];
			acc = column[12];
			geofenceId = column[4];
			console.log(lat + " " + lng + " " + acc);
			
	//	}
		lt = new google.maps.LatLng(lat, lng);
		createCircleWithOptions(map, lt, "Geofence " + geofenceId, parseInt(acc) );
		//console.log(lat + " " + lng + " " + acc);
		
	}
}
