let db = firebase.firestore();
let alertDlg = document.getElementById('alert-dialog');
let form = document.querySelector("form");
let salonCat = "";
let userId = "";
let vendorName = "";
let area = "";
let phoneNumber = "";
let poster = "";
let vendorID = "";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userId = user.uid;
        console.log(userId);

        db.collection("BHub").doc(userId).get().then((it) => {
            if (it.data() != null) {
                if (it.data().name != null) {
                    document.getElementById('input-email').value = it.data().name;
                    document.getElementById('input-area').value = it.data().location;
                }
                console.log(it.data());

                let role = it.data().role;
                console.log(role);

                if (role === "salon") {
                    document.getElementById('vendor-role').innerHTML = "Salon name, address and category"
                    document.getElementById('come-to-me').style.display = "none";
                    document.getElementById('label-role').style.display = "none";
                }

                if (role === "gym") {
                    document.getElementById('vendor-role').innerHTML = "GYM name, address and category"
                    document.getElementById('come-to-me').style.display = "none";
                    document.getElementById('label-role').style.display = "none";
                }

                if (role === "trainer") {
                    document.getElementById('label-role').innerHTML = "Attached to GYM? Select";
                    document.getElementById('vendor-role').innerHTML = "Your name, address and category"
                    db.collection("BHub").get().then(function (snapshot) {
                        let gymItem = "";
                        let gymId = 0;
                        snapshot.forEach((doc) => {
                            let vendorRole = doc.data().role;
                            if (vendorRole === "gym") {
                                gymId++;
                                gymItem += `
                            <option value=${gymId}>${doc.data().name}</option>
                            `;
                            }
                        });
                        document.getElementById('attached-to-view').innerHTML = gymItem;
                    });
                }

                if (role === "beauty") {
                    document.getElementById('label-role').innerHTML = "Attached to Salon? Select";
                    document.getElementById('vendor-role').innerHTML = "Your name, address and category"
                    db.collection("BHub").get().then(function (snapshot) {
                        let salonItem = "";
                        let salonId = 0;
                        snapshot.forEach((doc) => {
                            let vendorRole = doc.data().role;
                            if (vendorRole === "salon") {
                                salonId++;
                                salonItem += `
                                <option value=${doc.data().userID}>${doc.data().name}</option>
                            `;
                            }
                        });
                        document.getElementById('attached-to-view').innerHTML = salonItem;
                    });
                }

                document.getElementById('attached-to-view').addEventListener('change', function () {
                    vendorID = this.value;
                    console.log(vendorID);

                });

                var category = it.data().category;
                if (it.data().category != null) {

                    if (category == "unisex") {
                        document.getElementById('radio-unisex').checked = true;
                    } else if (category == "women") {
                        document.getElementById('radio-women').checked = true;
                    } else if (category == "men") {
                        document.getElementById('radio-men').checked = true;
                    }
                }

                vendorName = it.data().name;
                area = it.data().location;
                phoneNumber = it.data().phoneNumber;
                poster = it.data().poster;
                console.log(category);

                if (it.data().poster != null) {
                    document.getElementById('img-category').src = it.data().poster;
                }
            }
        });
    }
});

document.getElementById('come-to-me').addEventListener('change', function () {
    if (this.checked) {
        let selectedId = document.getElementById('attached-to-view');
        vendorID = selectedId.value;
        document.getElementById('attached-to-view').style.display = "block";
    } else {
        vendorID = "";
        document.getElementById('attached-to-view').style.display = "none";
    }
});

document.getElementById('close-window-btn').addEventListener('click', (e) => {
    window.close();
});

$('#img-category').click(function () {
    $('#input-img-url').trigger('click');
});

$('#upload-img-btn').click(function () {
    $('#input-img-url').trigger('click');
});

$("#input-img-url").on("change", function (event) {
    if (!(/\.(png|jpg|jpeg)$/i).test(event.target.files[0].name)) {
        window.alert('File not suppoted, upload png, jpg or jpeg files only!');
        return;
    }
    selectedImgUri = event.target.files[0];
    let fileName = selectedImgUri.name;
    firebase.auth().onAuthStateChanged(function (user) {
        var userId = user.uid;
        let storageRef = firebase.storage().ref("BHub/" + "Salons/" + userId + fileName);
        let uploadTask = storageRef.put(selectedImgUri);
        uploadTask.on("state_changed", (snapshot) => {
            console.log(snapshot);
            percentageVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(percentageVal);
            console.log(userId);
        }, (error) => {
            console.log("Error is: " + error.message);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                console.log("ImageLink: " + url);
                imgdownloadUrl = url;
                var map = {
                    poster: imgdownloadUrl
                }
                db.collection("BHub").doc(userId).update(map).then(function (e) {
                    document.getElementById('img-category').src = url;
                });
            });
        });
    });
});

form.addEventListener(
    "submit",
    (event) => {
        let name = document.getElementById('input-email').value;
        let address = document.getElementById('input-area').value;
        let currency = document.getElementById('select-curr').value;
        let data = new FormData(form);
        let output = "";
        for (let entry of data) {
            output = `${entry[1]}`;
        }
        salonCat.innerText = output;
        console.log(`${name}" ", ${output}`);

        var map = {
            name: name,
            category: output,
            location: address,
            currency: currency,
            favClass: "fav fa fa-heart-o"
        }
        console.log(vendorID);

        db.collection("BHub").doc(userId).update(map).then(function () {
            if (vendorID != "") {
                let map = {
                    name: vendorName,
                    location: area,
                    phoneNumber: phoneNumber,
                    poster: poster,
                    userID: userId,
                }
                db.collection("BHub").doc(vendorID).collection("Workers").doc(userId).set(map).then(function () {
                    window.open("services.html", "_self");
                });
            } else {
                window.open("services.html", "_self");
            }
        });
        event.preventDefault();
    },
    false,
);