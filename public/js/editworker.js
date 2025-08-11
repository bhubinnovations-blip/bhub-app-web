
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
            document.getElementById('detail-name').innerHTML = it.data().name;
            document.getElementById('detail-phone').innerHTML = it.data().phoneNumber;
            document.getElementById('detail-from').innerHTML = it.data().location;

            if (it.data().poster != null) {
                document.getElementById('prof-pic-img').src = it.data().poster;
            }
        }
    });

    document.getElementById('reject-worker-btn').addEventListener('click', function () {
        db.collection("BHub").doc(userId).collection("Workers")
            .doc(clientId).delete().then(function () {
                close();
            });
    });

    document.getElementById('verify-worker-btn').addEventListener('click', function () {
        let map = {
            approved: "Approved",
        }
        db.collection("BHub").doc(userId).collection("Workers")
            .doc(clientId).update(map).then(function () {
                close();
            });
    });

    document.getElementById('close-window-btn').addEventListener('click', function () {
        close();
    });
}