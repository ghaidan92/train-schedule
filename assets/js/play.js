var config = {
    apiKey: "AIzaSyBbemBeIgvFaZU5dWCmKKDD0dawuvfV5hM",
    authDomain: "my-train-schedule-89fc5.firebaseapp.com",
    databaseURL: "https://my-train-schedule-89fc5.firebaseio.com",
    projectId: "my-train-schedule-89fc5",
    storageBucket: "my-train-schedule-89fc5.appspot.com",
    messagingSenderId: "216295803599"
};
firebase.initializeApp(config);
var database = firebase.database();

var trainName = "";
var destination = "";
var firstTime = "00:00";
var frequency = 0;
var nextArrival = 0;
// var minutesLeft = 0;

$("#add-train-btn").on("click", function () {
    //     e.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTime = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    // var nextArrival = $("#next-arrival").val().trim();
    // var minutesLeft = $("#minutes-left").val().trim();





    // console.log(nextArrival);
    // console.log(destination);
    // console.log(firstTime);
    // console.log(frequency);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        // nextArrival:nextArrival,
        // minutesLeft:minutesLeft


    });

    return false;
});

database.ref().on("child_added", function (snapshot) {

    // calculation to determine next arrival and minutes away
    var trainName = snapshot.val().trainName
    var destination = snapshot.val().destination
    var frequency = snapshot.val().frequency
    var firstTime = snapshot.val().firstTime




    // has the train come today?
    // this is one calculation
    //if no this is the calculation
    // if yes this is my calculation
    // look into maxMoment()
    var firstTimeArray = snapshot.val().firstTime.split(":");
    var firstTime = moment().hours(firstTimeArray[0]).minutes(firstTimeArray[1]);
    // console.log(moment());
    var maxMoment = moment.max(moment(), firstTime);

    if (maxMoment === firstTime) {

        // Format train arrival to be readable
        var tArrival = firstTime.format("hh:mm A");

        // Use firstTrainTime and current moment() to calculate minutes unitl next arrival
        var minutesAway = firstTime.diff(moment(), "minutes");

    } else {

        // differenceTimes is how long it has passed since first train of day
        var differenceTimes = moment().diff(firstTime, "minutes");

        // tRemainder is the left over of taking the diffferenceTimes and modulus frequency.
        var tRemainder = differenceTimes % frequency;

        // minutesAway takes the frequency and - the remainder. This number is always less than frequency
        var minutesAway = frequency - tRemainder;

        // Next arrival is the current time plus the minutesAway
        var tArrival = moment().add(minutesAway, "m").format("hh:mm A");
        console.log(tArrival);
        console.log(minutesAway);

    }


    var newRow = $("<tr>");

    var newCol1 = $("<td>");
    newCol1.text(snapshot.val().trainName)
    newRow.append(newCol1);

    var newCol2 = $("<td>");
    newCol2.text(snapshot.val().destination)
    newRow.append(newCol2);

    var newCol3 = $("<td>");
    newCol3.text(snapshot.val().firstTime)
    newRow.append(newCol3);

    var newCol4 = $("<td>");
    newCol4.text(snapshot.val().frequency)
    newRow.append(newCol4);

    var newCol5 = $("<td>");
    newCol5.text(tArrival)
    newRow.append(newCol5);

    var newCol6 = $("<td>");
    newCol6.text(minutesAway)
    newRow.append(newCol6);

    $("#train-body").append(newRow);



    // $("#name-dis").text(snapshot.val().trainName);
    // $("#destination-dis").text(snapshot.val().destination);
    // $("#next_dis").text(snapshot.val().firstTime);
    // $("#frequency-dis").text(snapshot.val().frequency);
});



