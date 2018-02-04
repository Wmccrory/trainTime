//Train Time//////////////////////////////////////////////////////////////

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAlsEFXDl4CfJaZbKG3pj_eeTQ_PB8ygAs",
	authDomain: "traintime-5749c.firebaseapp.com",
	databaseURL: "https://traintime-5749c.firebaseio.com",
	projectId: "traintime-5749c",
	storageBucket: "",
	messagingSenderId: "1054949144448"
};

firebase.initializeApp(config);

database = firebase.database();

/////////////////////////////////////////////////////////////////

//variable bank//
var trainName;
var trainDestination;
var trainTime;
var trainFreq;
var newTrain; //temporary variable pushing user entry into database object

//variables for formulas
var trainTimeConverted
var currentTime
var timeDifference
var timeRemainder
var nextTrainMinutes
var nextTrainTime

//function bank//

function userEntry () 
{
	var trainName = $("#trainName").val().trim();
	var trainDestination = $("#trainDestination").val().trim();
	var trainTime = $("#trainTime").val().trim();
	var trainFreq = $("#trainFreq").val().trim();

	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		freq: trainFreq
	};

	database.ref().push(newTrain);

	$("#trainName").val("");
	$("#trainDestination").val("");
	$("#trainTime").val("");
	$("#trainFreq").val("");
}

//site progression//

$("#submitbtn").on("click", function(event) {
	event.preventDefault();
	userEntry()
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	console.log(childSnapshot.val());

	var trainName = childSnapshot.val().name
	var trainDestination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().time;
	var trainFreq = childSnapshot.val().freq;

	var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years"); //Setting initial train time to correct format to interpret rest of formula
	var currentTime = moment();	//Setting current time to an object
	var timeDifference = moment().diff(moment(trainTimeConverted), "minutes"); //Getting time differential between initial train time and current time
	var timeRemainder = timeDifference % trainFreq; //Getting remainder between the two objects
	var nextTrainMinutes = trainFreq - timeRemainder; //Getting value of time remaining until next train arrives
	var nextTrainTime = moment().add(nextTrainMinutes, "minutes"); //Getting time of next train arrival

	$("#trainSchedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFreq + "</td><td>" + moment(nextTrainTime).format("HH:mm") + "</td><td>" + nextTrainMinutes + "</td></tr>")
});