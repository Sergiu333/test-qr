function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    // If found your qr code
    function timeToSeconds(timeStr) {
        var parts = timeStr.split(':');
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);
        var seconds = parseInt(parts[2], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function onScanSuccess(decodeText, decodeResult) {
        // Expresia regulată pentru a detecta data în formatul hh:mm:ss
        var datePattern = /\b(\d{1,2}:\d{2}:\d{2})\b/;

        // Găsim toate potențialele date din text
        var dates = decodeText.match(datePattern);

        if (!dates) {
            console.error("Nu s-a găsit nicio dată în text.");
            return;
        }

        // Se selectează prima dată găsită, dar poți ajusta logica după nevoie
        var decodedDate = dates[0];

        // Obține data și ora curentă a dispozitivului în format de 24 de ore
        var currentDate = new Date();
        var deviceHours = currentDate.getHours().toString().padStart(2, '0');
        var deviceMinutes = currentDate.getMinutes().toString().padStart(2, '0');
        var deviceSeconds = currentDate.getSeconds().toString().padStart(2, '0');
        var deviceDate = deviceHours + ":" + deviceMinutes + ":" + deviceSeconds;

        var body = document.querySelector('body');

        var decodedSeconds = timeToSeconds(decodedDate);
        var deviceSeconds = timeToSeconds(deviceDate);

        var difference = Math.abs(decodedSeconds - deviceSeconds);

        console.log(decodedDate.split(':')[2]);
        console.log(deviceDate.split(':')[2]);

        if (difference <= 2) {
            console.log("Success");
            body.classList.remove('red');
            body.classList.add('green');
            console.log(decodedDate, 'decodedDate');
            console.log(deviceDate, 'deviceDate');
        } else {
            console.error("err" + deviceDate);
            body.classList.remove('green');
            body.classList.add('red');
            console.log(decodedDate, 'decodedDate');
            console.log(deviceDate, 'deviceDate');
        }
    }





    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        {
            fps: 10,
            qrbos: 250,
            cameraId: "rear", // Setează cameraId la "rear" pentru a selecta camera din spate
            disableFlip: true, // Dezactivează flip-ul pentru a nu permite utilizatorului să schimbe camera
            formatsToShow: ['QR_CODE'], // Afișează doar coduri QR
            preferFrontCamera: false, // Nu prefera camera frontală
            singleScanDuration: 0, // Setează durata scanării la 0 pentru a scana continuu fără oprire
            showStopButton: false // Nu afișa butonul de oprire
        }
    );
    htmlscanner.render(onScanSuccess);
});
