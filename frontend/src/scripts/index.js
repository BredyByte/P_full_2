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
            // const response = await fetch('/api/generateLocation', {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            // if (!response.ok) {
            //     throw new Error(`Error: ${response.status} ${response.statusText}`);
            // }

            // const data = await response.json();
            // console.log('Response from server:', data);
            const address = 'P.za del Duomo, 20122 Milano MI, Italy';
            addMarkerByAddress(googleMap, address);
        } catch (error) {
            console.error('Error while making the request:', error);
        }
    });
}

function initMap() {
    let mapElement = document.getElementById('map');

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

        addMarkerByAddress(googleMap, "Av de Sor Teresa Prat, 15, Carretera de Cádiz, 29003 Málaga");
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

