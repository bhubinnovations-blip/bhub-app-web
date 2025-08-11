let svcId = localStorage.getItem("svc_id");
let db = firebase.firestore();
let userId = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        getBooking(userId);
        console.log(userId);
        
    }
});

function getBooking(uid) {
    let popSvcItem = "";
    db.collection("BHub").doc(uid).collection("History").doc(svcId).get().then(function(it) {
        if(it.data() != null) {
            console.log(it.data());
            
            popSvcItem += `<div id="svc-item-row">
                <img id="svc-img-row" src="${(it.data().poster != null) ? it.data().poster : "images/b_hub_logo.png"}" />
                <span id="svc-name-row">${it.data().name}</span>
                <span id="svc-period-row">${it.data().orderDate + " " + it.data().orderTime}</span>
                <span id="svc-price-row">UGX${parseInt(it.data().price).toLocaleString()}</span>
                </div>`;
            document.getElementById('svc-prod-list-view').innerHTML = popSvcItem;
            document.getElementById('book-details-price').innerHTML = `UGX${parseInt(it.data().price).toLocaleString()}`
            getVendorInfo(it.data().vendorID);
        }
    });
}

function getVendorInfo(vUid) {
    db.collection("BHub").doc(vUid).get().then(function(it) {
        if(it.data() != null) {
            document.getElementById('book-details-name').innerHTML = it.data().name;
            document.getElementById('book-details-phone').innerHTML = it.data().phoneNumber;
            document.getElementById('book-details-location').innerHTML = it.data().location;
            if(it.data().poster != null) {
                document.getElementById('book-details-img').src = it.data().poster;
            }
        }
    });
}

document.getElementById('close-window-btn').addEventListener('click', (e) => {
    close();
});