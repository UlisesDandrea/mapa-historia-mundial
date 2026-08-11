const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 10,
    minZoom: 2
}).addTo(map);

const historicalEvents = [
    {
        id: 1,
        title: "Construcción de la Gran Pirámide de Guiza",
        year: -2560,
        coords: [29.9792, 31.1342],
        description: "Se completa la tumba del faraón Keops.",
        imageUrl: "https://images.unsplash.com/photo-1604028054045-81a1796d426a?w=320"
    },
    {
        id: 2,
        title: "Caída de Constantinopla",
        year: 1453,
        coords: [41.0082, 28.9784],
        description: "El Imperio Otomano captura la capital bizantina.",
        imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=320"
    },
    {
        id: 3,
        title: "Patente de la Máquina de Vapor",
        year: 1769,
        coords: [55.8642, -4.2518],
        description: "James Watt patenta mejoras a la máquina de vapor, impulsando la Revolución Industrial.",
        imageUrl: "https://images.unsplash.com/photo-1577903823485-2e650ea0b0de?w=320"
    }
];

let currentMarkers = L.layerGroup().addTo(map);
let currentBorders = L.layerGroup().addTo(map);

const yearSlider = document.getElementById('year-slider');
const yearDisplay = document.getElementById('year-display');

function updateMapByYear(selectedYear) {
    currentMarkers.clearLayers();
    currentBorders.clearLayers();

    let displayTexto = selectedYear < 0 ? Math.abs(selectedYear) + " a.C." : selectedYear + " d.C.";
    yearDisplay.textContent = displayTexto;

    const activeEvents = historicalEvents.filter(event => {
        return event.year >= selectedYear - 50 && event.year <= selectedYear + 50;
    });

    activeEvents.forEach(event => {
        const marker = L.circleMarker(event.coords, {
            radius: 9,
            fillColor: "#e74c3c",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });

        // Aplicamos referrerpolicy="no-referrer" para que el servidor local no bloquee las imágenes externas
        let popupContent = `
            <h3>${event.title} (${event.year < 0 ? Math.abs(event.year) + ' a.C.' : event.year + ' d.C.'})</h3>
            <img src="${event.imageUrl}" alt="${event.title}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://via.placeholder.com/280x180.png?text=Error';">
            <p>${event.description}</p>
        `;

        marker.bindPopup(popupContent);
        currentMarkers.addLayer(marker);
    });

    if (typeof fronterasHistoricas !== 'undefined') {
        const activeBordersData = {
            "type": "FeatureCollection",
            "features": fronterasHistoricas.features.filter(feature => {
                return feature.properties.año_inicio <= selectedYear && feature.properties.año_fin >= selectedYear;
            })
        };

        L.geoJSON(activeBordersData, {
            style: function (feature) {
                return {
                    fillColor: feature.properties.color,
                    weight: 1,
                    opacity: 1,
                    color: '#fff',
                    dashArray: '3',
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<strong>${feature.properties.nombre}</strong><br>
                               Período: ${feature.properties.año_inicio < 0 ? Math.abs(feature.properties.año_inicio) + ' a.C.' : feature.properties.año_inicio + ' d.C.'} - 
                                         ${feature.properties.año_fin < 0 ? Math.abs(feature.properties.año_fin) + ' a.C.' : feature.properties.año_fin + ' d.C.'}`);
            }
        }).addTo(currentBorders);
    }
}

yearSlider.addEventListener('input', (e) => {
    updateMapByYear(parseInt(e.target.value));
});

// Inicialización
updateMapByYear(parseInt(yearSlider.value));