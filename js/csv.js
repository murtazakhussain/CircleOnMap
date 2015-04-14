$(function(){
	$('#csvFile').change(function (event) {
		var fileUrl = URL.createObjectURL(event.target.files[0]);

		$.get(fileUrl, function (data) {
			var columns  = data.split("\n");
			var geofenceColumns = [];
		
			for(var i = 1; i < columns.length; i++){
				if(columns[i].search('Geofence BREACHED') > 0){
					geofenceColumns.push(columns[i].split(","));
				}
			}
			
			console.log("Total Geofence Breached: " + geofenceColumns.length);
			
			for(var j = 0; j < geofenceColumns.length; j++){

				var column = geofenceColumns[j];
				
				var fenceType = "Type: " + column[2];
				var fenceID = " ID: " + column[3].split(" (")[0];
				
				var lat = column[3].split(" (")[1];
				var lng = column[4].split(" )\"")[0];
				
				var lt = new google.maps.LatLng(lat, lng);
		
				createCircleWithOptions(map, lt, fenceType+ fenceID);
			}
		});
	});
});
