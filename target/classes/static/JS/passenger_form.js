document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('passengerDetailsForm');

    // Set current date and time to datetime-local inputs
    const setCurrentDateTime = (inputId, options = {}) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = options.hours !== undefined ? String(options.hours).padStart(2, '0') : String(now.getHours()).padStart(2, '0');
        const minutes = options.minutes !== undefined ? String(options.minutes).padStart(2, '0') : String(now.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.getElementById(inputId).value = formattedDateTime;
    };

    setCurrentDateTime('passPurchased');
    setCurrentDateTime('passValidFrom');
    setCurrentDateTime('passValidTill', { hours: 23, minutes: 59 });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const data = {
            passengerName: formData.get('passengerName'),
            identificationType: formData.get('identificationType'),
            identificationNumber: formData.get('identificationNumber'),
            passPurchased: formData.get('passPurchased'),
            passValidFrom: formData.get('passValidFrom'),
            passValidTill: formData.get('passValidTill'),
            passengerAvatar: capturedImage.split(',')[1],
            passFare: formData.get('passFare')
        };

        console.log(data);

        fetch('http://localhost:8088/api/passenger/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/QR_Scanner-Tummoc/static/tummoc_main.html';
            } else {
                console.error('Failed to save passenger details');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    let cameraStream;
        const cameraModal = document.getElementById('cameraModal');
        const videoElement = document.getElementById('camera');
        const passengerAvatar = document.getElementById('passengerAvatar');
        let capturedImage = '';

        window.openCamera = () => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    cameraStream = stream;
                    videoElement.srcObject = stream;
                    cameraModal.style.display = 'block';
                })
                .catch(err => {
                    console.error('Error accessing the camera: ', err);
                });
        };

        window.captureImage = () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            capturedImage = canvas.toDataURL('image/png');
            passengerAvatar.src = capturedImage;

            cameraStream.getTracks().forEach(track => track.stop());
            cameraModal.style.display = 'none';
        };
});
