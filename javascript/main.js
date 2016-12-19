
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
	      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
		  document.getElementById('weather').innerHTML = html;
	    },
	    error: function(error) {
		  document.getElementById('weather').innerHTML = '<p>'+error+'</p>';
	    }
	});


	// Adds pins to the map and adds map to the page
	const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });

	geocode(data['activity-1-location'], function(results){
		map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
	});
	geocode(data['activity-2-location'], function(results){
		map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
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



