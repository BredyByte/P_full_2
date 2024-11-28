let googleMap;

document.addEventListener("DOMContentLoaded", () => {
    initialize();
});

function initialize() {
    main();
}

function main() {
    console.log('Hello world!');
    setupSearchForm();
}

function setupSearchForm() {
    const form = document.getElementById("search_form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const input = document.getElementById('search_input');

            if (input) {
                let inputValue = input.value.trim();

                if (inputValue === '') {
                    return;
                }

                const response = await fetch('/api/generateLocation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: inputValue })
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }


                const data = await response.json();
                console.log('Response from server:', data);

                // // Add a marker to the map
                // const address = 'P.za del Duomo, 20122 Milano MI, Italy';
                // addMarkerByAddress(googleMap, address);

                input.value = '';
            }

        } catch (error) {
            console.error('Error while making the request:', error);
        }
    });
}

function initMap() {
    const mapElement = document.getElementById('map');

    if (mapElement) {
        googleMap = new google.maps.Map(mapElement, {
            center: {lat: 33.9868, lng: -118.4733},
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        let newStyle = [
            { featureType: 'road', elementType: 'geometry', stylers: [{color: '#52b2bf'}, {lightness: 50}] },
            { featureType: 'water', elementType: 'geometry', stylers: [{color: '#82eefd'}, {lightness: 50}] },
            { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{color: '#59788e'}, {lightness: 50}] }
        ];

        googleMap.setOptions({styles: newStyle});


        const address = 'P.za del Duomo, 20122 Milano MI, Italy';
        addMarkerByAddress(googleMap, address);
    }
}

function addMarkerByAddress(map, address) {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            let marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: address
            });

            map.setCenter(results[0].geometry.location);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });
}

