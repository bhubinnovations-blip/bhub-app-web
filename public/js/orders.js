let price = 0;
let userId = "";
let db = firebase.firestore();
let clientId = localStorage.getItem("client_id");
let deliverTo = "";
let profPic = "";
let email = "";
let fullName = "";
let phone = "";
let vendorTitle = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        console.log(userId);
        getOrders(userId);
        getBooking(clientId);
    }
});

function getBooking(uid) {

    db.collection("BHub").doc(uid).get().then((it) => {
        if (it.data() != null) {
            deliverTo = it.data().deliverTo;
            profPic = it.data().profilePic;
            email = it.data().email;
            fullName = it.data().fName;
            phone = it.data().phoneNumber;
            document.getElementById('detail-email').innerHTML = it.data().email;
            document.getElementById('detail-name').innerHTML = it.data().fName + " " + it.data().lName;
            document.getElementById('detail-phone').innerHTML = it.data().phoneNumber;
            document.getElementById('detail-from').innerHTML = deliverTo;
        }
    });

    db.collection("New Orders").doc(uid).get().then(function (it) {
        if (it.data() !== null) {
            vendorTitle = it.data().vendorTitle;
            document.getElementById('book-time').innerHTML = it.data().scheduleTime;
            document.getElementById('book-date').innerHTML = it.data().schedule;
            document.getElementById('sub-total').innerHTML = "Ugx " + parseInt(it.data().price).toLocaleString();
            document.getElementById('book-period').innerHTML = it.data().takePlaceAt;
        }
    });
}

function getOrders(uid) {
    let orderItem = "";
    let prodcutItem = "";
    db.collection("BHub").doc(clientId).collection("Booking").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            if (doc.data().vendorID === uid && doc.data().period != null) {
                orderItem += `
                <div id="book-order">
                    <li id="book-name">${doc.data().name}</li>
                    <li id="book-worker">${doc.data().period} Appointment</li>
                    <span id="book-price" style="margin-right: 20px;">Ugx ${parseInt(doc.data().price).toLocaleString()}</span>
                </div>
               `;
               document.getElementById('order-title').style.display = "block";
            } else if(doc.data().vendorID === uid && doc.data().qty != null) {
                prodcutItem += `
                <div id="prod-item">
                    <li id="prod-name">${doc.data().name}</li>
                    <li id="prod-qty">${doc.data().qty}</li>
                    <li id="prod-price">Ugx ${parseInt(doc.data().price).toLocaleString()}</li>
                </div>
                `;
                document.getElementById('prod-title').style.display = "block";
            }
        });
        document.getElementById('book-schedule-order').innerHTML = orderItem;
        document.getElementById('book-schedule-prod').innerHTML = prodcutItem;
    });
}

document.getElementById('btn-check-out').addEventListener('click', (e) => {
    localStorage.setItem("salon_id", userId);
    localStorage.setItem("salon_name", vendorTitle);
    localStorage.setItem("client_id", clientId);
    open("vendororderstatus.html", "_self");
});

document.getElementById('close-window-btn').addEventListener('click', (e) => {
    close();
});

document.getElementById('btn-check-out').addEventListener('click', (e) => {
    let d = new Date()
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let dateM = d.getDate() + " " + month + " " + d.getFullYear();
    let timeM = moment().format('hh:mm a');

    console.log(day);
    let salonName = localStorage.getItem("salon_name");
    let vendorID = localStorage.getItem("salon_id");
    let email = document.getElementById('detail-email').innerHTML;
    let fullName = document.getElementById('detail-name').innerHTML;
    let phone = document.getElementById('detail-phone').innerHTML;
    let schedule = document.getElementById('book-date').innerHTML;
    localStorage.setItem("time", time);
    localStorage.setItem("date", date);
    localStorage.setItem('email', email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("sub_total", price);
    localStorage.setItem("full_name", fullName);
    localStorage.setItem("salon_name", salonName);
    localStorage.setItem("salon_id", vendorID);

    let map = {
        email: email,
        orderDate: dateM,
        phone: phone,
        fullName: fullName,
        order: "pending",
        price: "" + price,
        paymentType: "Cash",
        orderTime: "Placed at: " + timeM,
        userID: userId,
        vendorID: vendorID,
        vendorTitle: salonName,
        schedule: schedule,
        profilePic: profPic,
        deliverTo: deliverTo,
    }
    db.collection("New Orders").doc(userId).set(map).then((it) => {
        open('orderstatus.html');
    });
});