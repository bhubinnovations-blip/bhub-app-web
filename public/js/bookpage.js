
let dbBook = firebase.firestore();


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        getBookings(userId);
    }
});

function getBookings(uid) {
    let popSvcItem = "";
    dbBook.collection("BHub").doc(uid).collection("History").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            popSvcItem += `<div id="svc-item-row" data-id="${doc.id}" class="${doc.data().name}">
                <img id="svc-img-row" src="${(doc.data().poster != null) ? doc.data().poster : "images/b_hub_logo.png"}" />
                <span id="svc-name-row">${doc.data().name}</span>
                <span id="svc-period-row">${(doc.data().qty != null) ? doc.data().qty : doc.data().period}</span>
                <span id="svc-price-row">UGX${parseInt(doc.data().price).toLocaleString()}</span>
                <span id="svc-arrow-row" class="material-symbols-outlined">chevron_right</span>
                <span style="width: 100%; height: 100%; position: absolute;" class="pop"></span>
                </div>`;

            document.getElementById("dummy-book-txt").style.display = "none";
            document.getElementById("dummy-book-txt-no").style.display = "none"
        });

        document.getElementById('svc-prod-list-view').innerHTML = popSvcItem;
    });
}

let items = [];
let listPop = document.querySelector("#svc-prod-list-view");
listPop.addEventListener('click', (event) => {
    var positionClick = event.target;
    console.log(positionClick);
    if (positionClick.classList.contains('pop')) {
        var svc_id = positionClick.parentElement.dataset.id;
        console.log(items);
        localStorage.setItem("svc_id", svc_id);
        open("bookdetails.html");
    }
});