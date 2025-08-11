let userId = "";
let db = firebase.firestore();

firebase.auth().onAuthStateChanged(function (user) {
    if(user) {
        userId = user.uid;
        getWorkers(userId);
    }
});

function getWorkers(uid) {
    let workerItem = "";
    db.collection("BHub").doc(uid).collection("Workers").get().then(function (snapshot) {
        snapshot.forEach((doc) => {
            workerItem += `
            <div class="${doc.data().userID}" style="height: 100px; position: relative; margin-top: 20px; margin-left: 20px; margin-right: 20px;">
            <img id="orders-img" class="poster" src="${doc.data().poster}" />
            <span style="position: absolute; left: 100px; right: 3rem; color: white; font-weight: 300; font-size: 14px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().name}</span>
            <span style="color: white; position: absolute; top: 30px; left: 100px; right: 1rem; font-weight: 100; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().location}</span>
            <span style="position: absolute; bottom: 25px; left: 100px; right: 3rem; color: white; font-weight: 300; font-size: 14px;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${doc.data().phoneNumber}</span>
            <span style="color: gold; position: absolute; bottom: 5px; left: 100px; font-weight: 100; font-size: 14px;">${(doc.data().approved != null) ? "Approved" : "Pending approval"}</span>
            <p data-id="${doc.data().userID}" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" class="selected" ></p>
            </div>
            `;
        });
        document.getElementById('worker-container-view').innerHTML = workerItem;
    });

    document.getElementById('worker-container-view').addEventListener('click', (e) => {
        let position = e.target;
        if (position.classList.contains("selected")) {
            let item = position.dataset.id;
            console.log('ID: ' + item);
            localStorage.setItem("client_id", item);
            open("editworker.html");
        }
    });

    document.getElementById('close-window-btn').addEventListener('click', function () {
        close();
    });
}