// Main JavaScript file for shared functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load featured properties on homepage
    if (document.getElementById('featured-properties')) {
        loadFeaturedProperties();
    }
});

async function loadFeaturedProperties() {
    try {
        const response = await fetch('/data/properties.json');
        const data = await response.json();
        
        // Display only 3 featured properties
        const featuredProperties = data.properties.slice(0, 3);
        const container = document.getElementById('featured-properties');
        
        featuredProperties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            container.appendChild(propertyCard);
        });
    } catch (error) {
        console.error('Error loading featured properties:', error);
        showError('Failed to load featured properties');
    }
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
                <a href="pages/houses.html" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `;
    
    return col;
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
}

function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}
