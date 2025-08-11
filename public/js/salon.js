let db = firebase.firestore();
let userId = "";
let role = "";
let clients = 0;
let dlgText = document.getElementById('dlg-text');
let alertDlg = document.getElementById('alert-dialog');
let body = document.querySelector('body');
let home = document.querySelector('.nav__link__home');
let book = document.querySelector('.nav__link__book');
let prof = document.querySelector('.nav__link__prof');

// pages
let favPage = document.querySelector('.fav__page');
let bookPage = document.querySelector('.book__page');
let profPage = document.querySelector('.prof__page');

function openAbout() {
    open("aboutus.html");
}

function openAPrivacy() {
    open("privacy.html");
}

function openTerms() {
    open("terms.html");
}

function openAContact() {
    open("contactus.html");
}

function openLinkedIn() {
    open("https://www.linkedin.com/company/bhubapp/");
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        console.log(userId);
        setWallet(userId);
        getClients(userId);

        db.collection("BHub").doc(userId).get().then((it) => {
            if (it.data() != null && it.data().name != null) {
                console.log(it.data());
                document.getElementById('salon-prof-name').innerHTML = it.data().name;

                if(it.data().role != "salon") {
                    document.getElementById('_beauty').style.display = "none";
                }

                if (it.data().poster != null) {
                    document.getElementById('img-salon').src = it.data().poster;
                }

                if (it.data().status != null) {
                    let status = it.data().status;
                    if (status == "Online") {
                        document.getElementById('online').checked = true;
                    } else if (status == "Offline") {
                        document.getElementById('offline').checked = true;
                    }
                }
            }
        });
    }
});

function getClients(uid) {
    clients = 0;
    db.collection("New Orders").get().then(function (snapshot) {
        snapshot.forEach((doc) => {
            if(doc.data().vendorID === uid || doc.data().workerID === uid) {
                clients++;
                console.log(clients);
                let percClients = clients / 100;

                document.getElementById('total-lients').innerHTML = clients;
                document.getElementById('total-client-perc').innerHTML = percClients + "% ^";
            } 
        });
    });
}

function setWallet(uid) {
    count = 0;
    let wallet = 0;
    let hairPrice = 0;
    let beardPrice = 0;
    let handsPrice = 0;
    let bodyPrice = 0;
    let facePrice = 0;
    let massagePrice = 0;
    let otherPrice = 0;
    let prodName = "";
    db.collection("BHub").doc(uid).collection("History").get().then(function (snapshot) {
        snapshot.forEach((doc) => {
            let vendorId = doc.data().vendorID;
            
            if(uid === vendorId) {
                count++;
                wallet += parseInt(doc.data().price);
                console.log(wallet);
                let percEarns = wallet / 100 /100;
                document.getElementById('total-aerns').innerHTML = wallet.toLocaleString();
                document.getElementById('total-aerns-per').innerHTML = percEarns + "% ^";

                prodName = doc.data().name;
                if(prodName.indexOf("Hair")) {
                    hairPrice += parseInt(doc.data().price);
                    document.getElementById('hair-price').innerHTML = hairPrice.toLocaleString();
                } else if(doc.data().qty != null) {
                    otherPrice += parseInt(doc.data().price);
                    document.getElementById('other-price').innerHTML = otherPrice.toLocaleString();
                }
            }
        });
        document.getElementById('wallet').innerHTML = `Wallet: Ugx ${wallet.toLocaleString()}`
    });
}

document.getElementById('_beauty').addEventListener('click', function () {
    open("workers.html");
});

home.addEventListener('click', (e) => {
    home.classList.add('nav__link--active');
    book.classList.remove('nav__link--active');
    prof.classList.remove('nav__link--active');

    favPage.style.display = "none";
    bookPage.style.display = "none";
    profPage.style.display = "none";
});

book.addEventListener('click', (e) => {
    home.classList.remove('nav__link--active');
    book.classList.add('nav__link--active');
    prof.classList.remove('nav__link--active');

    favPage.style.display = "none";
    bookPage.style.display = "block";
    profPage.style.display = "none";
});

prof.addEventListener('click', (e) => {
    home.classList.remove('nav__link--active');
    book.classList.remove('nav__link--active');
    prof.classList.add('nav__link--active');

    favPage.style.display = "none";
    bookPage.style.display = "none";
    profPage.style.display = "block";
});

$('#img-salon').click(function () {
    localStorage.setItem("vendor_role", role);
    open('category.html');
});

$('#edit-prof-btn').click(function () {
    localStorage.setItem("vendor_role", role);
    open('category.html');
});

$('#pro-svc-btn').click(function () {
    localStorage.setItem("user_id", userId);
    open("products.html");
});

$('#_support').click(function () {
    open("support.html");
});

$('#_notifications').click(function () {
    open('notifications.html');
});

$('#_wallet').click(function () {
    open('wallet.html');
});

$('#_history').click(function () {
    open('history.html');
});

$('#online').click(function () {
    var map = {
        status: "Online"
    }
    db.collection("BHub").doc(userId).update(map);
    console.log('Online');
});

$('#offline').click(function () {
    var map = {
        status: "Offline"
    }
    db.collection("BHub").doc(userId).update(map);
    console.log('Offline');
});

document.getElementById('logout-btn').addEventListener('click', (e) => {
    console.log("clicked");
    alertDlg.showModal();
});

function logout() {
    firebase.auth().signOut().then(function () {
        window.close();
        window.open("index.html");
    }, function (error) {
        console.log("Something went wrong!");
    });
}

function closeDlg() {
    alertDlg.close();
}