let timer;
let userId = "";
let vendorID = localStorage.getItem("salon_id");
let salonName = localStorage.getItem("salon_name");
let clientId = localStorage.getItem("client_id");

var userName = "";
var vendorItem = "";
var vendorName = "";
var currency = "UGX";
var subTotal = 0;

let count = 0;
var totalPrice = 0;
var cartItemRow = "";
var countryCode = "";
var phoneNo = "";
let db = firebase.firestore();
let alertDlg = document.getElementById('alert-dialog');
let forwardDlg = document.getElementById('forward-dialog');

let role = "";
let orderTime = moment().format("hh:mm a");
var d = new Date()
var month = String(d.getMonth() + 1).padStart(2, '0');
let orderDate = d.getDate() + "/" + month + "/" + d.getFullYear();


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        console.log(userId);
        getVendorInfo(vendorID);
        getWorkers(userId)
        startTimer(clientId);
    }
});

async function getVendorInfo(vUid) {

    var db = firebase.firestore();
    db.collection("BHub").doc(vUid).get().then((doc) => {
        if (doc.data() != null) {
            role = doc.data().role;
            phoneNo = doc.data().phoneNumber;
            console.log("Salon Phone: " + phoneNo);
        }
    });
}

function startTimer(userID) {
    timer = setInterval(function () {
        checkOrder(userID);
    }, 1000);
}

async function checkOrder(uid) {
    db.collection("New Orders").doc(uid).get().then(function (userData) {
        if (userData.data() != null) {
            var order = userData.data().order;
            if (order == "preparing") {
                document.getElementById('btn-check-out').value = "START JOB";
                document.getElementById('order-confirm-dot').style.backgroundColor = "orangered";
                document.getElementById('order-confirm-txt').style.color = "orangered";
                document.getElementById('order-confirm-line').style.backgroundColor = "orangered";

            } else if (order == "delivering") {
                document.getElementById('btn-check-out').value = "END JOB";
                document.getElementById('order-confirm-dot').style.backgroundColor = "orangered";
                document.getElementById('order-confirm-txt').style.color = "orangered";
                document.getElementById('order-confirm-line').style.backgroundColor = "orangered";
                document.getElementById('order-work-dot').style.backgroundColor = "orangered";
                document.getElementById('order-work-line').style.backgroundColor = "orangered";
                document.getElementById('order-work-txt').style.color = "orangered";

            } else if (order == "received") {
                localStorage.setItem("salon_id", vendorID);
                localStorage.setItem("salon_name", salonName);
                localStorage.setItem("rate_user", "no");
                localStorage.setItem("client_id", clientId);
                // open("payment.html", "_self");
            }
        }
    });
}

function getWorkers(uid) {
    let workerItem = "";
    db.collection("BHub").doc(uid).collection("Workers").get().then(function (snapshot) {
        snapshot.forEach((doc) => {
            if (doc.data().approved != null) {
                workerItem += `<option value="${doc.data().userID}">${doc.data().name}</option>`;
            }
        });
        document.getElementById('attached-to-view').innerHTML = workerItem;
    });
}

document.getElementById('btn-check-out').addEventListener('click', function () {
    let updateText = document.getElementById('btn-check-out').value;
    console.log(`Text: ${updateText}`);
    if (updateText === "CONFIRM BOOKING") {
        var map = {
            order: "preparing",
        }
        db.collection("New Orders").doc(clientId).update(map);
    } else if (updateText === "START JOB") {
        if (role === "salon" || role === "gym") {
            alertDlg.showModal();

            document.getElementById('dialog-no-btn').addEventListener('click', function () {

                var map = {
                    order: "delivering",
                }
                db.collection("New Orders").doc(clientId).update(map).then(function () {
                    alertDlg.close();
                });
            });

            document.getElementById('dialog-yes-btn').addEventListener('click', function () {
                alertDlg.close();
                forwardDlg.showModal();
            });

            document.getElementById('forward-no-btn').addEventListener('click', function () {
                forwardDlg.close();
            });

            document.getElementById('forward-yes-btn').addEventListener('click', function () {
                let workerID = document.getElementById('attached-to-view').value;
                let map = {
                    workerID: workerID,
                }
                console.log(workerID);
                db.collection("New Orders").doc(clientId).update(map).then(function () {
                    forwardDlg.close();
                });
            });
        } else {
            var map = {
                order: "delivering",
            }
            db.collection("New Orders").doc(clientId).update(map);
        }
    } else if (updateText === "END JOB") {
        localStorage.setItem("rate_user", "no");
        var map = {
            order: "received",
        }
        db.collection("New Orders").doc(clientId).update(map).then(function () {
            db.collection("BHub").doc(clientId).collection("Booking").get().then(function (snapshot) {
                snapshot.forEach((doc) => {
                    let map = {
                        name: doc.data().name,
                        price: doc.data().price,
                        period: (doc.data().period != null) ? doc.data().period : null,
                        qty: (doc.data().qty != null) ? doc.data().qty : null,
                        vendorID: vendorID,
                        userID: clientId,
                        orderDate: orderDate,
                        orderTime: orderTime,
                        poster: (doc.data().poster != null) ? doc.data().poster : null,
                    }
                    db.collection("BHub").doc(clientId).collection("History").doc().set(map).then(function () {
                        db.collection("BHub").doc(vendorID).collection("History").doc().set(map).then(function () {
                            open("paymentvendor.html", "_self");
                        });
                    });
                });
            });
        });
    }
});

document.getElementById('close-window-btn').addEventListener('click', (e) => {
    close();
});