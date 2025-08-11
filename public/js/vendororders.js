let myId = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        myId = user.uid;
        console.log(myId);
        getOrders(myId)
    }
});

function getOrders(uid) {
    let prodcutItem = "";
    db.collection("New Orders").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            if (doc.data().vendorID === uid || doc.data().workerID === uid) {
                prodcutItem += `
            <div class="${doc.data().userID}" style="height: 80px; position: relative; margin-top: 20px; margin-left: 20px; margin-right: 20px;">
            <img data-id="${doc.data().vendorID}" id="orders-img" class="poster" src="${doc.data().profilePic}" />
            <span style="position: absolute; top: 5px; left: 100px; right: 3rem; color: white; font-weight: 300; font-size: 14px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().fullName}</span>
            <span style="color: white; position: absolute; top: 35px; left: 100px; right: 1rem; font-weight: 100; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().deliverTo}</span>
            <span style="position: absolute; bottom: 5px; left: 100px; right: 3rem; color: gold; font-weight: 300; font-size: 14px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">UGX${parseInt(doc.data().price).toLocaleString()}</span>
            <span style="color: white; position: absolute; bottom: 5px; right: 0px; font-weight: 100; font-size: 14px;">${(doc.data().order === "completed") ? "Completed" : doc.data().order}</span>
            <p data-id="${doc.data().userID}" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="selected" ></p>
            </div>
            `;

                if (doc.data() !== null) {
                    let yourFavTxt = document.getElementById('all-you-fav-txt');
                    let noFavTxt = document.getElementById('no-fav-txt');

                    yourFavTxt.style.display = "none";
                    noFavTxt.style.display = "none";
                }
            }
        });
        document.getElementById('product-list-view').innerHTML = prodcutItem;
    });

    document.getElementById('product-list-view').addEventListener('click', (e) => {
        let position = e.target;
        if (position.classList.contains("material-icons") && position.innerHTML === "favorite") {
            let item = position.parentElement.classList.value;
            console.log(item);
            db.collection('Favorite').doc(userId).collection('Salons').doc(item).delete().then(function () {
                getFavorites(userId);
            });
        } else if (position.classList.contains("selected")) {
            let item = position.dataset.id;
            console.log('ID: ' + item);
            localStorage.setItem("client_id", item);
            db.collection("New Orders").doc(item).get().then(function (it) {
                if(it.data() != null && it.data().order === "completed") {
                    open("vendorhistory.html");
                } else {
                    open("orders.html");
                }
            });
        }
    });
}