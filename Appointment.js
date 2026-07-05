const http = require('http');
const url = require('url');

const appointments = [];

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname.replace(/\/$/, ''); // Remove trailing slash
    const method = req.method;

    // Set standard response headers
    res.setHeader('Content-Type', 'application/json');

    // --- POST /api/appointments: Create a new appointment ---
    if (pathname === '/api/appointment' && method === 'POST') {
        let body = '';

        // 1. Collect the incoming data payload
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // 2. Process the data and respond
        req.on('end', () => {
            const { name, phone, date } = JSON.parse(body);

            // Basic Validation: Ensure all necessary fields are present
            if (!appointmentId || !name || !phone || !date) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ 
                    error: "Missing required appintment fields (name, phone, date)" 
                }));
            }
            
            // Log the appointment (simulating a database save)
            const newAppointment = {
                id: appointments.length + 1,
                name,
                phone,
                date,
                timestamp: new Date().toISOString()
            };

            appointments.push(newAppointment);

            // Success Response: Return 200 Created and the new appointment ID
            res.statusCode = 200; 
            res.end(JSON.stringify({ 
                message: "Appointment schedules successfully", 
                appointmentId: newAppointment.id 
            }));
        });
    }

    else if (pathname === '/api/appointments' && method === 'GET') {
        res.statusCode = 200;
        // Return the entire array of appointments
        res.end(JSON.stringify(appointments)); 
    }

    // --- Handle unknown or unsupported routes ---
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Route not found or method not supported" }));
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Minimal Reservation Server running on http://localhost:${PORT}`);
    console.log(`Listening for POST requests at /api/appointments`);

});
