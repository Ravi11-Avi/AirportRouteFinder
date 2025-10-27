const map = L.map('map').setView([22.9734, 78.6569], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom : 14,
}).addTo(map)

let rootline  = null;
let markers = [];


document.getElementById("routeForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    const res = await fetch("/shortest_path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end })
    }); 
        const data = await res.json();
    const resultDiv = document.getElementById("result");


    markers.forEach(m => map.removeLayer(m));
    if (rootline) map.removeLayer(rootline);
    markers = [];

    if (data.path) {
        resultDiv.innerHTML = `
            <h3>Shortest Path:</h3>
            <p>${data.path.join(" → ")}</p>
            <p><strong>Total Distance:</strong> ${data.distance} km</p>
            <span style =" color :white ; background: green; padding : 5px; border-radius: 5px;">Route calculated successfully!</span>
        `;


        const coord =  data.path.map(code => {
            const a  =  airportData.find(ap => ap.code ===code)
            return [a.lat,a.lon]
        })

        coord.forEach(([lat, lon], i) => {
            const airport = airportData.find(ap => ap.code === data.path[i]);
            const marker = L.marker([lat, lon])
                .bindPopup(`<b>${airport.name}</b><br>${airport.code}`)
                .addTo(map);
            markers.push(marker);


        routeline = L.polyline(coord, { color: 'blue', weight: 4 }).addTo(map);

        map.fitBounds(routeline.getBounds());

        });
    } else {
        resultDiv.innerHTML = `<p style="color:red;">No route found.</p>`;
    }
});  








 document.addEventListener('DOMContentLoaded', function() {
            
            
            // Form submission animation
            const routeForm = document.getElementById('routeForm');
            if (routeForm) {
                routeForm.addEventListener('submit', function(e) {
                    const resultDiv = document.getElementById('result');
                    if (resultDiv) {
                        resultDiv.innerHTML = '<div class="loading"></div><p>Calculating route...</p>';
                        resultDiv.classList.add('show');
                    }
                });
            }
            
            // Select focus animations
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-2px)';
                });
                
                select.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'translateY(0)';
                });
            });
        });