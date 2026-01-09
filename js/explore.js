let properties = [];
let map = null;
let currentProperty = null;

document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupFilterListeners();
});

async function loadProperties() {
    try {
        showLoading();
        const response = await fetch('/data/properties.json');
        const data = await response.json();
        properties = data.properties;
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        showError('Failed to load properties');
    } finally {
        hideLoading();
    }
}

function setupFilterListeners() {
    document.getElementById('price-range').addEventListener('change', filterProperties);
    document.getElementById('city').addEventListener('change', filterProperties);
    document.getElementById('state').addEventListener('change', filterProperties);
}

function filterProperties() {
    const priceRange = document.getElementById('price-range').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    let filtered = properties.filter(property => {
        let matchesPrice = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(val => 
                val.endsWith('+') ? Infinity : Number(val)
            );
            matchesPrice = property.price >= min && property.price <= max;
        }

        const matchesCity = !city || property.location.includes(city);
        const matchesState = !state || property.location.includes(state);

        return matchesPrice && matchesCity && matchesState;
    });

    displayProperties(filtered);
}

function displayProperties(propertiesToShow) {
    const grid = document.getElementById('properties-grid');
    grid.innerHTML = '';

    propertiesToShow.forEach(property => {
        const propertyCard = createPropertyCard(property);
        grid.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    col.innerHTML = `
        <div class="card property-card h-100">
            <img src="${property.image}" class="card-img-top property-image" alt="${property.title}">
            <div class="card-body">
                <h5 class="card-title">${property.title}</h5>
                <p class="card-text">${property.location}</p>
                <p class="card-text">
                    <strong>$${property.price.toLocaleString()}</strong>
                </p>
                <button class="btn btn-primary view-details" data-property-id="${property.id}">
                    View Details
                </button>
            </div>
        </div>
    `;

    col.querySelector('.view-details').addEventListener('click', () => showPropertyDetails(property));
    return col;
}

async function showPropertyDetails(property) {
    currentProperty = property;
    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
    
    // Update modal content
    document.getElementById('property-details').innerHTML = `
        <img src="${property.image}" class="img-fluid mb-3" alt="${property.title}">
        <h4>${property.title}</h4>
        <p>${property.description}</p>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
                <p><strong>Location:</strong> ${property.location}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Bedrooms:</strong> ${property.details.bedrooms}</p>
                <p><strong>Bathrooms:</strong> ${property.details.bathrooms}</p>
                <p><strong>Square Feet:</strong> ${property.details.sqft}</p>
            </div>
        </div>
    `;

    modal.show();

    // Initialize map after modal is shown
    modal._element.addEventListener('shown.bs.modal', function () {
        initializeMap(property.coordinates);
        loadWeatherData(property.coordinates);
        displayCrimeStats();
    });
}

function initializeMap(coordinates) {
    if (map) {
        map.remove();
    }

    map = L.map('map').setView([coordinates.lat, coordinates.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([coordinates.lat, coordinates.lng]).addTo(map);
}

async function loadWeatherData(coordinates) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&units=imperial&appid=YOUR_API_KEY`);
        const data = await response.json();

        document.getElementById('weather-data').innerHTML = `
            <div class="row">
                <div class="col-6">
                    <p>Temperature: ${Math.round(data.main.temp)}°F</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                </div>
                <div class="col-6">
                    <p>Weather: ${data.weather[0].main}</p>
                    <p>Wind: ${Math.round(data.wind.speed)} mph</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading weather data:', error);
        document.getElementById('weather-data').innerHTML = '<p>Weather data unavailable</p>';
    }
}

function displayCrimeStats() {
    const ctx = document.getElementById('crimeChart').getContext('2d');
    
    // Mock crime data
    const data = {
        labels: ['Theft', 'Burglary', 'Assault', 'Vehicle Theft'],
        datasets: [{
            label: 'Incidents per 100,000 residents',
            data: [250, 150, 100, 75],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
