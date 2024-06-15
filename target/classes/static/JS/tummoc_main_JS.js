let html5QrCode;

function fetchPassengerDetails() {
    fetch('http://localhost:8088/api/passenger/get')
        .then(response => response.json())
        .then(data => {
            console.log(data); // For testing purposes
            document.getElementById('passengerName').textContent = data.passengerName;
            document.getElementById('identificationType').textContent = data.identificationType;
            document.getElementById('identificationNumber').textContent = data.identificationNumber;
            document.getElementById('passPurchased').textContent = data.passPurchased;
            document.getElementById('passValidFrom').textContent = data.passValidFrom;
            document.getElementById('passValidTill').textContent = data.passValidTill;
            document.getElementById('passengerAvatar').src = 'data:image/png;base64,' + data.passengerAvatar;
            document.getElementById('passFare').textContent = '₹' + data.passFare;
        })
        .catch(error => console.error('Error fetching passenger details:', error));
}


function fetchDataAndUpdateContent() {
    fetch('http://localhost:8088/api/qrcode/last-validation')
        .then(response => response.json())
        .then(data => {
            console.log(data); // For testing purposes
            document.getElementById('lastValidatedInfo').textContent = data.validatedAt;
            document.getElementById('busNumberInfo').textContent = data.busNumber;
        })
        .catch(error => console.error('Error:', error));
}

// Load data from the server and update content
fetchDataAndUpdateContent();


// Function to open the QR scanner
function openQRScanner() {
    var modal = document.getElementById("qrModal");
    modal.style.display = "block";

    html5QrCode = new Html5Qrcode("reader");
    html5QrCode
        .start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                disableFlip: false,
            },
            (qrCodeMessage) => {
                console.log(`QR Code detected: ${qrCodeMessage}`);

                // Handle the QR code data here
                handleQRCodeDetected(qrCodeMessage);

                // Close the modal after QR code is detected
                html5QrCode
                    .stop()
                    .then(() => {
                        closeQRScanner();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            (errorMessage) => {
                // Parse error, ignore it
            }
        )
        .catch((err) => {
            console.log(err);
        });
}

function closeQRScanner() {
    var modal = document.getElementById("qrModal");
    modal.style.display = "none";
    if (html5QrCode) {
        html5QrCode
            .stop()
            .then(() => {
                html5QrCode.clear();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// Function to handle QR code detection
function updateContent(data) {
    // Update specific elements on your page with data from the backend
    document.getElementById('lastValidatedInfo').textContent = data.validatedAt;
    document.getElementById('busNumberInfo').textContent = data.busNumber;
    // You can add more code here to update other elements as needed
}

function updateZoom() {
    const zoomLevel = document.getElementById("zoom-bar").value;
    html5QrCode
        .applyVideoConstraints({ advanced: [{ zoom: zoomLevel }] })
        .catch((err) => {
            console.log(err);
        });
}

window.onclick = function (event) {
    var modal = document.getElementById("qrModal");
    if (event.target == modal) {
        closeQRScanner();
    }
};

window.onload = function () {
    fetchPassengerDetails();

}