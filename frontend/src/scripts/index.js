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
            const response = await fetch('/api/generateLocation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Response from server:', data);
        } catch (error) {
            console.error('Error while making the request:', error);
        }
    });
}
