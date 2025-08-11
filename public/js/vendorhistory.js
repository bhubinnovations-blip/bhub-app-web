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
    }
});

function getOrders(uid) {
    let orderItem = "";
    let prodcutItem = "";
    db.collection("BHub").doc(uid).collection("History").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            if (clientId === doc.data().userID && doc.data().period != null) {
                orderItem += `
                <div id="book-order">
                    <li id="book-name">${doc.data().name}</li>
                    <li id="book-worker">${doc.data().period} Appointment</li>
                    <span id="book-price" style="margin-right: 20px;">Ugx ${parseInt(doc.data().price).toLocaleString()}</span>
                </div>
               `;
               document.getElementById('order-title').style.display = "block";
            } else if(clientId === doc.data().userID && doc.data().qty != null) {
                prodcutItem += `
                <div id="prod-item">
                    <li id="prod-name">${doc.data().name}</li>
                    <li id="prod-qty">${doc.data().qty}</li>
                    <li id="prod-price">Ugx ${parseInt(doc.data().price).toLocaleString()}</li>
                </div>
                `;
                document.getElementById('prod-title').style.display = "block";
            }

            if (doc.data() !== null) {
                let yourFavTxt = document.getElementById('all-you-fav-txt');
                let noFavTxt = document.getElementById('no-fav-txt');

                yourFavTxt.style.display = "none";
                noFavTxt.style.display = "none";
            }
        });
        document.getElementById('book-schedule-order').innerHTML = orderItem;
        document.getElementById('book-schedule-prod').innerHTML = prodcutItem;
    });
}