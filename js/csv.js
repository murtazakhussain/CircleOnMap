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
				if(columns[i].search('Geofence BREACHED') > 0){
					geofenceColumns.push(columns[i].split(","));
				}
			}			
			
			for(var i = 1; i < columns.length; i++){
				if(columns[i].search('Location') > 0){
					//Latitude: 32.5497708 Longitude: -83.8858245 Accuracy: 2254.0
					locationColumns.push(columns[i].split(" "));
				}
			}
			console.log(locationColumns);
			createLocationCircle(locationColumns);
			
			
			$('#breaches').text(geofenceColumns.length);
			
			for(var j = 0; j < geofenceColumns.length; j++){

				var column = geofenceColumns[j];
				
				var fenceType = "Type: " + column[2];
				var fenceID = " ID: " + column[3].split(" (")[0];
				
				var lat = column[3].split(" (")[1];
				var lng = column[4].split(" )\"")[0];
				
				var lt = new google.maps.LatLng(lat, lng);
		
				createCircleWithOptions(map, lt, fenceType + fenceID);
			}
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
	
	for(var j = 0; j < locationColumns.length; j++){

		var column = locationColumns[j];

		var lat = column[1];
		var lng = column[3];
		var acc = column[5].split("\",\"")[0];
		console.log(lat + " " + lng + " " + acc);

		var lt = new google.maps.LatLng(lat, lng);

		createCircleWithOptions(map, lt, "BL", parseInt(acc) );
	}
}