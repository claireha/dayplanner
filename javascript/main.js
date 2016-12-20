
// Turns the entire form into a jQuery object
const form = $('.js-form');

// When the submit button on the form is clicked, run the function onSubmit()
form.submit(onSubmit);

// Define the function onSubmit, that pulls in the event object 
function onSubmit(e) {

// Prevents default submit action that causes refresh on click
	e.preventDefault();

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
	const activity1url = data['activity-1-URL'];
	const activity1notes = data['activity-1-notes'];
	const activity2name = data['activity-2-name'];
	const activity2placename = data['activity-2-place-name'];
	const activity2location = data['activity-2-location'];
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
		<div id="map"></div>
		<div id="right-panel">
           <p>Total Distance: <span id="total"></span></p>
	`);

	// function for the weather 
	reallySimpleWeather.weather({
	    wunderkey: '', // leave blank for Yahoo
	    location: activity1location, //your location 
	    woeid: '', // "Where on Earth ID"
	    unit: 'f', // 'c' also works
	    success: function(weather) {
	      html = '<h2>'+weather.temp+'°'+weather.units.temp+'</h2>';
	      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	      html += '<li>'+weather.currently+'</li>';
	      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>'
		  document.getElementById('weather').innerHTML = html;
	    },
	    error: function(error) {
		  document.getElementById('weather').innerHTML = '<p>'+error+'</p>';
	    }
	});

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

 		geocode(data['activity-2-location'], function(results){
 			loc2 = results[0].geometry.location;
 			addr2 = results[0].formatted_address;
 			console.log('##########', results)
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



