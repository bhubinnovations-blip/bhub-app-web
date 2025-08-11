

let myId = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        myId = user.uid;
        console.log(myId);
        getFavorites(myId)
    }
});

function getFavorites(uid) {
    let prodcutItem = "";
    db.collection("Favorite").doc(uid).collection("Salons").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            prodcutItem += `
            <div class="${doc.data().name}" style="height: 80px; position: relative; margin-top: 20px; margin-left: 20px; margin-right: 20px;">
            <img data-id="${doc.data().vendorID}" style="width: 120px; height: 100%; border-radius: 6px; position: absolute; left: 0;" class="poster" src="${doc.data().poster}" />
            <span style="position: absolute; top: 5px; left: 130px; right: 3rem; color: white; font-weight: 300; font-size: 14px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().name}</span>
            <span style="color: white; position: absolute; top: 35px; left: 130px; right: 3rem; font-weight: 100; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().location}</span>
            <span class="material-icons" style="position: absolute; bottom: 15px; right: 0; color: gold;">favorite</span>
            </div>
            `;

            if (doc.data() !== null) {
                let yourFavTxt = document.getElementById('all-you-fav-txt');
                let noFavTxt = document.getElementById('no-fav-txt');

                yourFavTxt.style.display = "none";
                noFavTxt.style.display = "none";
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
        } else if (position.classList.contains("poster")) {
            let item = position.dataset.id;
            console.log('ID: ' + item);
            localStorage.setItem("salon_id", item);
            open("bhub.html");
        }
    });
}