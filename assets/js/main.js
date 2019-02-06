// Initialize Firebase
var config = {
    apiKey: "AIzaSyBzNqgoUtKV9EYpoYmTy5eXzAt2Zo4fDpI",
    authDomain: "testing-firebase-a8804.firebaseapp.com",
    databaseURL: "https://testing-firebase-a8804.firebaseio.com",
    projectId: "testing-firebase-a8804",
    storageBucket: "testing-firebase-a8804.appspot.com",
    messagingSenderId: "1068939047740"
};
firebase.initializeApp(config);

let database = firebase.database().ref("/votes");

let auth = firebase.auth();

$("#subBtn").on("click", (event) => {
    console.log("clicked");
    let email = $("#email").val().trim();
    let password = $("#password").val().trim();
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).catch((error) => console.log(error))
})

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
        $("#log").hide()
        $("#vote").show();
        if (user.photoURL != null) {
            $(".buttonArea").hide();
            $(".outputArea").show();
        }
    } else {
        console.log("not signed in");
        $("#vote").hide();
        $("#log").show()
    }
});

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

$(".vote").on("click", function () {
    console.log($(this).attr("data-vote"));
    let thisVote = $(this).attr("data-vote")
    database.once("value", function (snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.val().votes)
        let choice = snapshot.val().votes;
        console.log(choice);
        console.log(thisVote);
        choice.push(thisVote);
        console.log(choice);
        database.set({
            votes: choice
        })
        auth.currentUser.updateProfile({
            photoURL: "Voted"
        })
        $(".buttonArea").hide()
        $(".outputArea").show();
    })
})

function setDatabase() {
    database.set({
        votes: ["Yay"],
    })
}

let userImage = auth.currentUser;
console.log(userImage);

database.on("value", function (snap) {
    let ballot = snap.val().votes;
    console.log(ballot);
    let yays = ballot.filter((vote) => vote === "Yay")
    console.log(yays)
    let nays = ballot.filter((vote)=> vote === "Nay");
    console.log(nays);
    $("#yayNum").text(yays.length);
    $("#nayNum").text(nays.length);
    if (yays.length > nays.length) {
        $("#winner").text("Smoker")
    } else if (yays.length === nays.length) {
        $("#winner").text("Neither");
    } else {
        $("#winner").text("Instant-Pot");
    }
})