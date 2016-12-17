const inputField = $('.js-form');
// Now all the inputs are in a bunch of different arrays 

// Get weather API and print weather of that locale
// Get activity-1-location and activity-2-location and get
// Google Maps API to get distance from the two 
// Print it all neatly 

inputField.submit(onDataBack);

function onDataBack(e) {
	e.preventDefault();

	console.log('here')
}


// Verify the form

$('.field.example form')
  .form({
    on: 'blur',
    fields: {
      empty: {
        identifier  : 'empty',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a value'
          }
        ]
      }
    }
  })
;