
// Turns the entire form into a jQuery object
const form = $('.js-form');

// When the submit button on the form is clicked, run the function onSubmit()
form.submit(onSubmit);

// Define the function onSubmit, that pulls in the event object 
function onSubmit(e) {

// Creates an object variable that is empty and then 
// Data is added to it via a loop
	const data = {};

// This is the loop that repeats for # of inputs (arrays)
	$('.js-input').each(function(index, currentEl) {
		currentEl = $(currentEl);

		const isOptional = typeof currentEl.attr('data-optional') !== "undefined";

		if ( currentEl.val() === "" && !isOptional ) {
			currentEl.parent().addClass('error')
		}
		else {
			data[currentEl.attr('name')] = currentEl.val();
		}
	});

	console.log(form.find('.error'))
	console.log(data)
	if(form.find('.error').length > 0) {
		return;
	}
	else {
		console.log('done')
		addPinsToGoogleMap(data);
	}
}

function parseParms() {
    const params = window.location.search.split('?').pop();
    const args = params.split('&');
    return args.reduce((hash, curr) => {
      const bits = curr.split('=');

      hash[bits[0]] = decodeURIComponent(bits[1])
      return hash;
    }, {});
}

if (window.location.search) {
	const params = parseParms();
	console.log(params)
	addPinsToGoogleMap(params);
}

$('.js-input').focus(function() {
	if ($(this).parent().hasClass('error')) {
		$(this).parent().removeClass('error')
	}
});

function addPinsToGoogleMap(data) {

	// clears the wrapper
	const wrapper = $('.js-wrapper');
	wrapper.html('');

	// changes the header to include Plans Name value and date value 
	const plansName = data['plans-name'];
	const plansDate = data['date'];

	$('#js-label').html('<h1>' + plansName + '</h1><h2>' + plansDate + '</h2>');

	const activity1name = data['activity-1-name'];
	const activity1placename = data['activity-1-place-name'];
	const activity1location = data['activity-1-location'];
	const activity1time = data['activity-1-time'];
	const activity1url = data['activity-1-URL'];
	const activity1notes = data['activity-1-notes'];
	const activity2name = data['activity-2-name'];
	const activity2placename = data['activity-2-place-name'];
	const activity2location = data['activity-2-location'];
	const activity2time = data['activity-2-time'];
	const activity2url = data['activity-2-URL'];
	const activity2notes = data['activity-2-notes'];
	

	// Shows stuff below the maps
	$('#js-results-wrapper').html(`
		<table class="ui selectable unstackable celled table">
		  <thead>
		    <tr>
		      <th>${activity1name}</th>
		      <th>Details</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>Place Name: </td>
		      <td>${activity1placename}</td>
		    </tr>
		     <tr>
		      <td>Location: </td>
		      <td>${activity1location}</td>
		    </tr>
		    <tr>
		      <td>Time: </td>
		      <td>${activity1time}</td>
		    </tr>
		 	<tr>
		      <td>URL: </td>
		      <td><a href="${activity1url}">${activity1url}</a></td>
		    </tr>
		    <tr>
		      <td>Notes</td>
		      <td>${activity1notes}</td>
		    </tr>
		  </tbody>
		</table>

		<table class="ui selectable unstackable celled table">
		  <thead>
		    <tr>
		      <th>${activity2name}</th>
		      <th>Details</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>Place Name: </td>
		      <td>${activity2placename}</td>
		    </tr>
		     <tr>
		      <td>Location: </td>
		      <td>${activity2location}</td>
		    </tr>
		    <tr>
		      <td>Time: </td>
		      <td>${activity2time}</td>
		    </tr>
		 	<tr>
		      <td>URL: </td>
		      <td><a href="${activity2url}">${activity2url}</a></td>
		    </tr>
		    <tr>
		      <td>Notes</td>
		      <td>${activity2notes}</td>
		    </tr>
		  </tbody>
		</table>
		</div>
		<div id="js-weather"></div>
		<div id="map"></div>
		<div id="right-panel">
           <p>Total Distance: <span id="total"></span></p>
        </div>

	`);




	console.log(data)


	// Adds pins to the map and adds map to the page
	const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 13
    });

	geocode(data['activity-1-location'], function(results){
		let loc1;
		let loc2;

		let addr1;
		let addr2;

		loc1 = results[0].geometry.location;
		addr1 = results[0].formatted_address;
		map.setCenter(loc1);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });

        getWeatherForecast(results[0].geometry.location.lat(), results[0].geometry.location.lng())

 		geocode(data['activity-2-location'], function(results){
 			loc2 = results[0].geometry.location;
 			addr2 = results[0].formatted_address;
			map.setCenter(loc2);
	        var marker = new google.maps.Marker({
	            map: map,
	            position: results[0].geometry.location
	        });

			var directionsService = new google.maps.DirectionsService;
	        var directionsDisplay = new google.maps.DirectionsRenderer({
	          draggable: true,
	          map: map,
	          panel: document.getElementById('right-panel')
	        });

	        directionsDisplay.addListener('directions_changed', function() {
	          computeTotalDistance(directionsDisplay.getDirections());
	        });

	        console.log(addr1, addr2)

	        displayRoute(addr1, addr2, directionsService,
	            directionsDisplay);
		});
	});	 

}


// dark sky function

function getWeatherForecast(lat,lng){
	$.ajax({
	url: `https://api.darksky.net/forecast/ab7c4c121757f535420a689dfd6daacd/${lat},${lng}`,
	method: 'GET',
	dataType: 'jsonp'
	}).then((data) => {
		console.log(data)
		const currentTemp = data.currently['temperature'];
		const currentSummary = data.currently['summary'];
		const dailySummary = data.daily['summary'];
		$('#js-weather').append(`

		<table class="ui selectable unstackable celled table">
		  <thead>
		    <tr>
		      <th>Weather</th>
		      <th>Details</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>Current Temp: </td>
		      <td>${currentTemp}°</td>
		    </tr>
		     <tr>
		      <td>Current Weather: </td>
		      <td>${currentSummary}</td>
		    </tr>
		 	<tr>
		      <td>Week Summary: </td>
		      <td>${dailySummary}</td>
		    </tr>
		  </tbody>
		</table>
		</div>
			`);

	})
}


// Gets the geocode for the locations
function geocode(address, callback) {
	const geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': address}, function(results, status) {
		if (typeof callback === "function" && status === 'OK') {
			callback(results);
		}
		else {
			console.log('Geocode was not successful for the following reason: ' + status)
		}
	});
}


// GOOGLE DRAGGABLE MAP START
function initMap() {

        // var map = new google.maps.Map(document.getElementById('map'), {
        //   zoom: 4,
        //   center: {lat: -24.345, lng: 134.46}  // Australia.
        // });

        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer({
        //   draggable: true,
        //   map: map,
        //   panel: document.getElementById('right-panel')
        // });

        // directionsDisplay.addListener('directions_changed', function() {
        //   computeTotalDistance(directionsDisplay.getDirections());
        // });

        // displayRoute('Perth, WA', 'Sydney, NSW', directionsService,
        //     directionsDisplay);
      }

      function displayRoute(origin, destination, service, display) {
        service.route({
          origin: origin,
          destination: destination,
          // waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
          travelMode: 'DRIVING',
          avoidTolls: true
        }, function(response, status) {
          if (status === 'OK') {
            display.setDirections(response);
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
      }

      function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById('total').innerHTML = total + ' km';
      }

// GOOGLE END
