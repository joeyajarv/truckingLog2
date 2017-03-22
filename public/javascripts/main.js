class main {
    constructor() {
        main.loadServiceWorker();
        main.prepApp();
        new EventHandler();
    }

    static loadServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/ServiceWorker.js');
        }
    }

    static prepApp() {
        document.getElementById('log').style.display = 'block';
        document.getElementById('result').style.display = 'none';
    }
}

class EventHandler {
    constructor() {
        this.handleEnterLog();
        this.handleNewLog();
    }

    handleEnterLog() {
        document.getElementById('enterLog').addEventListener('click', () => {
            let numTrips = Number(document.getElementById('tripNums').value);
        let tripDate = document.getElementById('tripDate');
        let pickUpLocation = document.getElementById('pickUpLocation');
        let pickUpAddress = document.getElementById('pickUpAddress');
        let pickUpTime = document.getElementById('pickUpTime');
        let pickUpNum = Number(document.getElementById('pickUpNum').value);
        let numBOL = Number(document.getElementById('numBOL').value);
        let numLDTrailer = Number(document.getElementById('numLDTrailer').value);
        let numMTTrailer = Number(document.getElementById('numMTTrailer').value);
        let deliveryLocation = document.getElementById('deliveryLocation');
        let deliveryAddress = document.getElementById('deliveryAddress');
        let deliveryTime = document.getElementById('deliveryTime');
        let deliveryDate = document.getElementById('deliveryDate');
        let deliveryNum = Number(document.getElementById('deliveryNum').value);
        let ldMiles = Number(document.getElementById('ldMiles').value);
        let mtMiles = Number(document.getElementById('mtMiles').value);
        console.log(typeof numTrips);
        let trip = 1;

        if (trip == 1) {
            document.getElementById('log').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            let data = new FormData(document.querySelector('#logData'));
            this.performAjax('XMLHttpRequest2', data);
        } else {
            alert(`Invalid trip data, please try again.`);
        }
    })
    }

    handleNewLog() {
        document.getElementById('newLog').addEventListener('click', () => {
            document.getElementById('logData').reset();
        document.getElementById('result').style.display = 'none';
        document.getElementById('log').style.display = 'block';
    });
    }

    performAjax(requestNum, sendToNode, callback) {
        let bustCache = '?' + new Date().getTime();
        const XHR = new XMLHttpRequest();
        XHR.open('POST', document.url + bustCache, true);
        XHR.setRequestHeader('X-Requested-with', requestNum);
        XHR.send(sendToNode);
        XHR.onload = () => {
            if (XHR.readyState == 4 && XHR.status == 200 && callback) {
                return callback(XHR.responseText);
            }
        };
    }
}

window.addEventListener('load', () => {
    new main();
});


/*
 http://stackoverflow.com/a/17067016/466246 (for of JSON object)
 for (const ITEM of data.entries()) {
 console.log(ITEM);
 }
 */