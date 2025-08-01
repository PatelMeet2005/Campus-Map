// Enhanced location and building data with better organization
var locations = {
    "Home": null, // Will be set to user location
    "Xerox": [22.601573181938143, 72.82045628855217],
    "Bank": [22.60117618960099, 72.82051541076538],
    "Canteen": [22.601510479109173, 72.82052613960055],
    "Admin Office": [22.59939, 72.82045],
    "Hospital": [22.602696581265278, 72.82126642928722],
};

// Define buildings with their coordinates and additional metadata
var buildings = {
    'A2 Building RPCP': {
        coords: [22.599368402415315, 72.81978535046156],
        description: 'Research and Project Center',
        facilities: ['Research Labs', 'Project Rooms', 'Conference Hall']
    },
    'A3 Building IIIM': {
        coords: [22.600035369257835, 72.82076191232372],
        description: 'Institute of Infrastructure, Technology, Research and Management',
        facilities: ['Lecture Halls', 'Computer Labs', 'Library']
    },
    'A5 DEPSTAR BUILDING': {
        coords: [22.600820337176675, 72.82026689653912],
        description: 'Department of Science and Technology',
        facilities: ['Science Labs', 'Engineering Workshops', 'Cafeteria']
    },
    'A6 CSPIT EC Building': {
        coords: [22.60029, 72.81946],
        description: 'Electronics and Communication Department',
        facilities: ['EC Labs', 'Research Center', 'Seminar Halls']
    },
    'A7 CSPIT CE Building': {
        coords: [22.59951, 72.81817],
        description: 'Civil Engineering Department',
        facilities: ['CE Labs', 'Drawing Halls', 'Material Testing Lab']
    },
    'A8 PDPIAS BUILDING': {
        coords: [22.601687189963116, 72.819595859821],
        description: 'P. D. Patel Institute of Applied Sciences',
        facilities: ['Science Labs', 'Research Facilities', 'Auditorium']
    },
    'A9 CMPICA BUILDING': {
        coords: [22.603348466570708, 72.8184282975782],
        description: 'Charotar Institute of Computer Applications',
        facilities: ['Computer Labs', 'IT Infrastructure', 'Innovation Hub']
    }
};

// State management
const appState = {
    userLocation: null,
    routeControl: null,
    lastMarker: null,
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    favoriteLocations: JSON.parse(localStorage.getItem('favoriteLocations') || '[]'),
    isLoading: false
};

// Utility functions
const utils = {
    showToast: function(message, type = 'success') {
        try {
            // Remove any existing toasts first
            const existingToasts = document.querySelectorAll('.toast');
            existingToasts.forEach(toast => toast.remove());
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, 3000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    },
    
    showLoader: function() {
        if (!document.querySelector('.loading-spinner')) {
            const loader = document.createElement('div');
            loader.className = 'loading-spinner';
            loader.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loader);
        }
        document.querySelector('.loading-spinner').style.display = 'block';
        appState.isLoading = true;
    },
    
    hideLoader: function() {
        const loader = document.querySelector('.loading-spinner');
        if (loader) {
            loader.style.display = 'none';
        }
        appState.isLoading = false;
    },
    
    addToSearchHistory: function(location) {
        if (!appState.searchHistory.includes(location)) {
            appState.searchHistory.unshift(location);
            if (appState.searchHistory.length > 10) {
                appState.searchHistory.pop();
            }
            localStorage.setItem('searchHistory', JSON.stringify(appState.searchHistory));
        }
    },
    
    addToFavorites: function(location) {
        try {
            if (!appState.favoriteLocations.includes(location)) {
                appState.favoriteLocations.push(location);
                localStorage.setItem('favoriteLocations', JSON.stringify(appState.favoriteLocations));
                this.showToast(`${location} added to favorites!`);
            } else {
                this.showToast(`${location} is already in favorites!`, 'warning');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            this.showToast('Error adding to favorites', 'error');
        }
    }
};

// Combine all locations and buildings for autocomplete suggestions
var allPlaces = [
    ...Object.keys(locations).filter(key => key !== 'Home'),
    ...Object.keys(buildings)
];

// Initialize the map and set an initial view with enhanced configuration
var map = L.map('map', {
    zoomControl: false,
    attributionControl: false
}).setView([22.589220, 72.795967], 15);

// Add zoom control to top right
L.control.zoom({
    position: 'topright'
}).addTo(map);

// Add attribution control to bottom left
L.control.attribution({
    position: 'bottomleft',
    prefix: false
}).addTo(map);

// Enhanced tile layers
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
});

var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

// Enhanced layer control
var baseMaps = {
    "🗺️ Streets": streets,
    "🛰️ Satellite": satellite,
    "🌙 Dark Mode": dark
};

L.control.layers(baseMaps, null, {
    position: 'topright',
    collapsed: false
}).addTo(map);

// Load saved theme after layers are defined
setTimeout(() => {
    loadSavedTheme();
}, 100);

// Enhanced location handling with better error management
map.on('locationfound', function (e) {
    appState.userLocation = e.latlng;
    locations.Home = appState.userLocation;

    // Create custom user location marker
    var userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #3498db; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [21, 21],
        iconAnchor: [10, 10]
    });

    var userMarker = L.marker(appState.userLocation, {icon: userIcon})
        .addTo(map)
        .bindPopup('📍 You are here')
        .openPopup();

    utils.showToast('Location found successfully!');
    utils.hideLoader();
    
    // Show quick access panel
});

map.on('locationerror', function (e) {
    console.error('Location error:', e);
    utils.hideLoader();
    utils.showToast('Location access denied. Using default location.', 'warning');
    
    // Set default location (college campus)
    appState.userLocation = [22.599220, 72.795967];
    locations.Home = appState.userLocation;
    
});

// Show loading while getting location
utils.showLoader();
map.locate({ 
    setView: true, 
    maxZoom: 16,
    timeout: 10000,
    enableHighAccuracy: true
});

// Add debugging
console.log('Map initialized successfully');
console.log('App state:', appState);

// Enhanced route drawing with better styling and error handling
function drawRoute(destinationCoords) {
    if (!appState.userLocation) {
        utils.showToast('Location not available. Please enable location services.', 'error');
        return;
    }

    try {
        // Remove previous route control if it exists
        if (appState.routeControl) {
            map.removeControl(appState.routeControl);
        }

        utils.showLoader();

        appState.routeControl = L.Routing.control({
            waypoints: [
                L.latLng(appState.userLocation),
                L.latLng(destinationCoords)
            ],
            routeWhileDragging: true,
            lineOptions: {
                styles: [{ 
                    color: '#3498db', 
                    opacity: 0.8, 
                    weight: 6,
                    dashArray: '10, 5'
                }]
            },
            createMarker: function() { return null; },
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false
        }).on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Display route information
            const distance = (summary.totalDistance / 1000).toFixed(2);
            const time = Math.round(summary.totalTime / 60);
            
            utils.hideLoader();
            utils.showToast(`Route found: ${distance} km, ~${time} minutes`, 'success');
        }).on('routingerror', function(e) {
            utils.hideLoader();
            utils.showToast('Could not find route. Please try again.', 'error');
        }).addTo(map);

    } catch (error) {
        utils.hideLoader();
        utils.showToast('Error creating route. Please try again.', 'error');
        console.error('Route error:', error);
    }
}

// Enhanced location navigation with better UX and error handling
function goToLocation(locationName) {
    if (appState.isLoading) return;
    
    // Cancel the previous search before starting a new one
    cancelSearch();
    utils.showLoader();

    try {
        // Add to search history
        utils.addToSearchHistory(locationName);

        let coords = null;
        let popupContent = locationName;

        // Check if the location is a predefined location
        if (locations[locationName] && locations[locationName] !== null) {
            coords = locations[locationName];
        } else if (buildings[locationName]) {
            coords = buildings[locationName].coords;
            const building = buildings[locationName];
            popupContent = `
                <div style="text-align: center;">
                    <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${locationName}</h4>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #7f8c8d;">${building.description}</p>
                    <div style="font-size: 11px; color: #95a5a6;">
                        ${building.facilities.join(' • ')}
                    </div>
                    <button onclick="utils.addToFavorites('${locationName}')" 
                            style="margin-top: 8px; padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                        ⭐ Add to Favorites
                    </button>
                </div>
            `;
        }

        if (coords) {
            // Animate map view
            map.flyTo(coords, 18, {
                duration: 1.5
            });

            // Create enhanced marker
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">📍</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            });

            appState.lastMarker = L.marker(coords, {icon: markerIcon})
                .addTo(map)
                .bindPopup(popupContent)
                .openPopup();

            drawRoute(coords);
            utils.hideLoader();
        } else {
            // Perform geocoding search for unknown locations
            geocoder.options.geocoder.geocode(locationName, function(results) {
                utils.hideLoader();
                
                if (results.length > 0) {
                    const result = results[0];
                    map.flyTo(result.center, 15, {
                        duration: 1.5
                    });

                    appState.lastMarker = L.marker(result.center)
                        .addTo(map)
                        .bindPopup(`
                            <div style="text-align: center;">
                                <h4 style="margin: 0 0 5px 0;">${result.name}</h4>
                                <button onclick="utils.addToFavorites('${result.name}')" 
                                        style="margin-top: 5px; padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    ⭐ Add to Favorites
                                </button>
                            </div>
                        `)
                        .openPopup();

                    drawRoute(result.center);
                } else {
                    utils.showToast('Location not found. Please try a different search term.', 'error');
                }
            });
        }
    } catch (error) {
        utils.hideLoader();
        utils.showToast('Error searching for location. Please try again.', 'error');
        console.error('Location search error:', error);
    }
}

// Enhanced search cancellation
function cancelSearch() {
    // Remove the last route control if it exists
    if (appState.routeControl) {
        map.removeControl(appState.routeControl);
        appState.routeControl = null;
    }

    // Remove the last marker if it exists
    if (appState.lastMarker) {
        map.removeLayer(appState.lastMarker);
        appState.lastMarker = null;
    }
}

// Enhanced suggestions with search history and favorites
function updateSuggestions(input) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (!input) {
        // Show recent searches and favorites when no input
        const recentSearches = appState.searchHistory.slice(0, 5);
        const favorites = appState.favoriteLocations.slice(0, 5);
        
        [...new Set([...favorites, ...recentSearches])].forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            suggestions.appendChild(option);
        });
        return;
    }

    const inputLower = input.toLowerCase();
    
    // Prioritize exact matches, then favorites, then general matches
    const exactMatches = allPlaces.filter(place => 
        place.toLowerCase() === inputLower
    );
    
    const favoriteMatches = appState.favoriteLocations.filter(place => 
        place.toLowerCase().includes(inputLower)
    );
    
    const generalMatches = allPlaces.filter(place => 
        place.toLowerCase().includes(inputLower) && 
        !exactMatches.includes(place) && 
        !favoriteMatches.includes(place)
    );

    const allMatches = [...exactMatches, ...favoriteMatches, ...generalMatches];

    allMatches.slice(0, 10).forEach(match => {
        const option = document.createElement('option');
        option.value = match;
        suggestions.appendChild(option);
    });
}

function showFavorites() {
    if (appState.favoriteLocations.length === 0) {
        utils.showToast('No favorite locations saved yet.', 'warning');
        return;
    }
    
    const searchBox = document.getElementById('searchBox');
    searchBox.focus();
    updateSuggestions('');
    utils.showToast(`${appState.favoriteLocations.length} favorites available`);
}

function showSearchHistory() {
    if (appState.searchHistory.length === 0) {
        utils.showToast('No recent searches.', 'warning');
        return;
    }
    
    const searchBox = document.getElementById('searchBox');
    searchBox.focus();
    updateSuggestions('');
    utils.showToast(`${appState.searchHistory.length} recent searches available`);
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = localStorage.getItem('mapTheme') || 'streets';
    let newTheme;
    
    if (currentTheme === 'streets') {
        newTheme = 'dark';
        if (map.hasLayer(streets)) map.removeLayer(streets);
        map.addLayer(dark);
        utils.showToast('Switched to Dark theme', 'info');
    } else if (currentTheme === 'dark') {
        newTheme = 'satellite';
        if (map.hasLayer(dark)) map.removeLayer(dark);
        map.addLayer(satellite);
        utils.showToast('Switched to Satellite view', 'info');
    } else {
        newTheme = 'streets';
        if (map.hasLayer(satellite)) map.removeLayer(satellite);
        map.addLayer(streets);
        utils.showToast('Switched to Streets view', 'info');
    }
    
    localStorage.setItem('mapTheme', newTheme);
    
    // Close settings dropdown
    closeSettings();
}

// Clear user data
function clearData() {
    if (confirm('Are you sure you want to clear all saved data (search history and favorites)?')) {
        localStorage.removeItem('searchHistory');
        localStorage.removeItem('favoriteLocations');
        appState.searchHistory = [];
        appState.favoriteLocations = [];
        utils.showToast('All data cleared successfully', 'warning');
        
        // Close settings dropdown
        closeSettings();
    }
}

// Admin panel access with password protection
function accessAdminPanel(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Close settings dropdown first
    closeSettings();
    
    // Create password modal
    const modal = document.createElement('div');
    modal.className = 'password-modal';
    modal.innerHTML = `
        <div class="password-modal-content">
            <div class="password-header">
                <h3>🔐 Admin Access Required</h3>
                <button class="close-modal" onclick="closePasswordModal()">&times;</button>
            </div>
            <div class="password-body">
                <p>Enter admin password to access the admin panel:</p>
                <input type="password" id="adminPassword" placeholder="Enter password..." maxlength="20">
                <div class="password-buttons">
                    <button onclick="verifyAdminPassword()" class="login-btn">Login</button>
                    <button onclick="closePasswordModal()" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on password input
    setTimeout(() => {
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            passwordInput.focus();
        }
    }, 100);
    
    // Add enter key support
    setTimeout(() => {
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    verifyAdminPassword();
                }
            });
        }
    }, 100);
}

// Verify admin password
function verifyAdminPassword() {
    const passwordInput = document.getElementById('adminPassword');
    
    if (!passwordInput) {
        utils.showToast('Password input not found', 'error');
        return;
    }
    
    const enteredPassword = passwordInput.value.trim();
    const correctPassword = 'admin'; // You can change this password
    
    if (enteredPassword === correctPassword) {
        // Password correct - redirect to admin panel
        utils.showToast('Access granted! Redirecting to admin panel...', 'success');
        closePasswordModal();
        
        // Redirect after a short delay
        setTimeout(() => {
            window.open('admin.html', '_blank');
        }, 1000);
    } else if (enteredPassword === '') {
        utils.showToast('Please enter a password', 'warning');
        passwordInput.focus();
    } else {
        // Password incorrect
        utils.showToast('Invalid password! Access denied.', 'error');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Add shake animation to modal
        const modal = document.querySelector('.password-modal-content');
        if (modal) {
            modal.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                modal.style.animation = '';
            }, 500);
        }
    }
}

// Close password modal
function closePasswordModal() {
    const modal = document.querySelector('.password-modal');
    if (modal) {
        modal.remove();
    }
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('mapTheme') || 'streets';
    
    // Remove all layers first
    if (map.hasLayer(streets)) map.removeLayer(streets);
    if (map.hasLayer(satellite)) map.removeLayer(satellite);
    if (map.hasLayer(dark)) map.removeLayer(dark);
    
    // Add the correct layer
    switch(savedTheme) {
        case 'dark':
            map.addLayer(dark);
            break;
        case 'satellite':
            map.addLayer(satellite);
            break;
        default:
            map.addLayer(streets);
    }
}

// Simple toggle function for settings dropdown
function toggleSettings(event) {
    console.log('toggleSettings called!');
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Event prevented and stopped');
    }
    
    const settingsList = document.getElementById('settingsList');
    console.log('Settings list element:', settingsList);
    
    if (settingsList) {
        const isCurrentlyShowing = settingsList.classList.contains('show');
        console.log('Currently showing:', isCurrentlyShowing);
        
        if (isCurrentlyShowing) {
            settingsList.classList.remove('show');
            console.log('Settings closed - removed show class');
        } else {
            settingsList.classList.add('show');
            console.log('Settings opened - added show class');
        }
        
        // Double check the class was added/removed
        console.log('Final state - has show class:', settingsList.classList.contains('show'));
        console.log('Element display style:', window.getComputedStyle(settingsList).display);
    } else {
        console.error('Settings list element not found!');
        // Try to find it by class instead
        const altSettingsList = document.querySelector('.settings-list');
        console.log('Alternative search result:', altSettingsList);
    }
}

// Global function for closing settings
function closeSettings() {
    const settingsList = document.getElementById('settingsList');
    
    if (settingsList) {
        settingsList.classList.remove('show');
    }
    
    // Remove any backdrop if it exists
    const backdrop = document.querySelector('.settings-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

// Enhanced event listeners with better UX
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const settingsButton = document.getElementById('settingsButton');
    
    if (!searchBox || !settingsButton) {
        console.error('Required elements not found');
        return;
    }
    
    // Enhanced search input handling
    searchBox.addEventListener('input', function(e) {
        updateSuggestions(e.target.value);
    });

    // Enhanced search on enter with loading state
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !appState.isLoading) {
            const searchText = e.target.value.trim();
            
            if (!searchText) {
                utils.showToast('Please enter a location to search', 'warning');
                return;
            }

            // Clear search box and blur to hide mobile keyboard
            e.target.value = '';
            e.target.blur();
            
            goToLocation(searchText);
        }
    });

    // Settings button now uses HTML onclick="toggleSettings()" - no event listener needed

    // Close settings when clicking outside
    document.addEventListener('click', function(e) {
        const settingsContainer = document.querySelector('.navbar-settings-container');
        
        if (settingsContainer && !settingsContainer.contains(e.target)) {
            closeSettings();
        }
    });

    // Show suggestions on search box focus
    searchBox.addEventListener('focus', function() {
        updateSuggestions(this.value);
    });

});

// Enhanced mobile menu toggle
function toggleMenu() {
    const menu = document.querySelector('.navbar-menu');
    const toggler = document.querySelector('.navbar-toggler');
    
    menu.classList.toggle('active');
    toggler.classList.toggle('active');
    
    // Add accessibility
    const isOpen = menu.classList.contains('active');
    toggler.setAttribute('aria-expanded', isOpen);
    toggler.innerHTML = isOpen ? '✕' : '☰';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+K or Cmd+K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchBox').focus();
    }
    
    // Escape to cancel current operation
    if (e.key === 'Escape') {
        if (appState.isLoading) {
            utils.hideLoader();
            appState.isLoading = false;
        }
        
        // Close settings dropdown
        closeSettings();
        
        // Blur search box
        document.getElementById('searchBox').blur();
    }
});

// Add double-click to recenter map
map.on('dblclick', function(e) {
    if (appState.userLocation) {
        map.flyTo(appState.userLocation, 16, {
            duration: 1.5
        });
        utils.showToast('Recentered to your location');
    }
});

// Add map click handler to close popups
map.on('click', function(e) {
    // Close any open popups after a short delay
    setTimeout(() => {
        map.closePopup();
    }, 100);
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    utils.showToast('An error occurred. Please refresh the page.', 'error');
});

// Make functions globally accessible and add simple test
window.goToLocation = goToLocation;
window.toggleMenu = toggleMenu;
window.showFavorites = showFavorites;
window.showSearchHistory = showSearchHistory;
window.toggleTheme = toggleTheme;
window.clearData = clearData;
window.closeSettings = closeSettings;
window.toggleSettings = toggleSettings;
window.accessAdminPanel = accessAdminPanel;
window.verifyAdminPassword = verifyAdminPassword;
window.closePasswordModal = closePasswordModal;

// Simple test function for settings
window.testSettings = function() {
    console.log('testSettings called!');
    const settingsList = document.getElementById('settingsList');
    
    if (settingsList) {
        settingsList.classList.toggle('show');
        console.log('Test: Settings toggled via test function');
        alert('Settings should be ' + (settingsList.classList.contains('show') ? 'OPEN' : 'CLOSED'));
    } else {
        alert('ERROR: Settings list not found!');
    }
};

// Simple test function
window.testFunction = function() {
    alert('JavaScript is working! Settings should work now.');
    console.log('Test successful');
};

console.log('All functions loaded successfully');

// Debug the settings button specifically
setTimeout(() => {
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        console.log('Settings button found:', settingsButton);
    } else {
        console.log('Settings button NOT found');
    }
}, 1000);
