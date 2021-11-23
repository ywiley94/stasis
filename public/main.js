// const { default: Moralis } = require("moralis/types");

const serverUrl = "https://dmxq2ygvqugv.usemoralis.com:2053/server";
const appId = "lDdw0E0PIXVhIinYPibBo7XgZU9YTiLZl2G1F8JM";

Moralis.start({ serverUrl, appId });
document.getElementById("btn-get-stats").onclick = getStats;


// Get User Balances
function getBalances() {
  const user = Moralis.User.current();
  if(user) {
    getUserBalances(user)
  }
}

async function getUserBalances(user) {
  const options = {address: "0x00b25D5cecC40798b59f3bae53d749FCAA2d326E"}
  const balances = await Moralis.Web3API.account.getTokenBalances(options);
  const results = balances
  console.log(results)
}
getBalances();

// Get Users
function getStats() {
  const user = Moralis.User.current();
  if (user) {
    getUserTransactions(user);
  }
}

async function getUserTransactions(user) {
  // create query
  const query = new Moralis.Query("EthTransactions");
  query.equalTo("from_address", user.get("ethAddress"));

  // run query
  const results = await query.find();
  console.log("user transactions:", results);
}

// get stats on page load
getStats();


/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  const query = new Moralis.Query("EthTransactions");
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
        window.location.href="/dashboard"
      })
      .catch(function (error) {
        console(error);
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;










// Start of calculator functionality

// Store buttons
var numbers   = document.getElementsByClassName( "numbers"  );
var operators = document.getElementsByClassName( "operator" );

// Store screens
var numberScreen = document.getElementById( "numberscreen" );
var calcScreen   = document.getElementById( "calcscreen"   );

// Store buttons by ID
var equals     = document.getElementById( "equals" );
var squareRoot = document.getElementById( "squareroot" );
var c 		   = document.getElementById( "c" );
var ce  	   = document.getElementById( "ce" );
var plusMinus  = document.getElementById( "±" );
var ans 	   = document.getElementById( "ans" );

// Initialize variables
// ______________________________________________

	// Stores the total to display when equals is clicked
	// First input when calculating
var total = 0,
	// Store the current calculation as a string to display
	// on calcScreen
    currCalc = "",
    // Store the number being entered, second input when calculating
    currNumber = "",
    // The number to be displayed in the numberScreen
    currDisplayNumber = 0,
    // Saves the previously entered operator, which is then calculated
    // when a new operator is pressed or when equals is pressed
    prevOperator,
    // If prevDecimal is true, a decimal will be added before the number
    // entered.
    prevDecimal,
    // Turns to false when a decimal is entered, preventing further
    // decimal entries until current number is restarted
    addDecimal = true,
    // Counts how many times need to times number by ten to do division
    decimalCounter = 0;
    // Stores the previous answer, which is displayed when ANS is pressed
    prevAns = 0;

// Bind events
// ______________________________________________

// Bind numberPressed event to number buttons
for ( var i = 0; i < numbers.length; i++ ) {
  numbers[i].onclick = numberPressed;  
}
// Bind operatorPressed to operator buttons
for ( var i = 0; i < operators.length; i++ ) {
  operators[i].onclick = operatorPressed;  
}

// Bind event to equals,c, square root, plus minus,
// ans and ce buttons
equals.onclick = sum;
c.onclick = clearAll;
ce.onclick = clearCurrNumber;
squareRoot.onclick = calcSquareRoot;
plusMinus.onclick = togglePlusMinus;
ans.onclick = prevAnswer;

// Functions bound to buttons
// ______________________________________________

// Adds pressed number to currNumber
function numberPressed() {

  // Value of current button
  var currVal = this.getAttribute( "func" );

  // Convert currNumber to string, add new number,
  // convert back to integer  
  var stringNum = currNumber.toString();
  
  // If a decimal was entered on last press, add 
  // a decimal before the current number being added.
  if ( prevDecimal ) {
  
    
    stringNum += ( "." + currVal )
    currNumber = parseFloat( stringNum );

    // Stops other decimals being added to currNumber
    prevDecimal = false;
    
  } else {

    // If a decimal was added, change addDecimal to true
    // This will add a decimal ro currNumber the next 
    // time a button is added
    if ( currVal == "." && addDecimal == true ) {

      prevDecimal = true;
      addDecimal = false;

    }  else if ( currVal == "." ){
    	return;
    }

    stringNum += currVal.toString();
    currNumber = parseInt( stringNum );    
  }


  // Show current number on number screen
  numberScreen.value = stringNum;
  
}

// Does calculation when operator pressed
function operatorPressed() {
  // Get operator as a string from button func attribute
  var operator = "";
  operator += this.getAttribute( "func" );
  
  // Add operator and current number to current calc
  currCalc += ( currNumber + " " + operator + " " );
  // Add currCalc to calc screen
  calcScreen.value = currCalc;  
  
  // If previous oeprator is defined, calculate new total,
  // Otherwie set total to be current number
  if ( prevOperator ) {
    total = findSum[ prevOperator ]( total, currNumber );
  } else {
    total = currNumber;
  }

  // Set prev operator to operator
  prevOperator = operator;
  
  // Reset number screen and curr number
  numberScreen.value = 0;
  currNumber = "";
  
  // Reset allow decimal
  addDecimal = true;
  
}


// Show total in screen when equals is pressed
function sum() {
  if ( prevOperator ) {
    total = findSum[prevOperator]( total, currNumber );
  }
  resetValues()
  // Use answer as current number
  prevAns = total;
}

// Calculate square root
function calcSquareRoot() {
  if ( typeof currNumber == "number" ) {
    // Convert number to array to check if it's negative
    var stringNum = currNumber.toString();
    var arrNum = stringNum.split("");

    // If number is negative, do not calculate
    if ( arrNum[0] == "-") {
      
      console.log("Square root of negative number does not exists")
      
    } else {
      
      total = findSum[ "√" ]( numberScreen.value );
      // Display total and reset values
      resetValues()
    }
  }

}

function clearAll() {
  
  total = 0;

  // Reset screen values
  resetValues();
  
}

// Clear current number from numberScreen
function clearCurrNumber() {

  currNumber = "";
  numberScreen.value = currNumber; 
  addDecimal = true;
  
}

// Use prevAns, previous answer, as currNumber
function prevAnswer() {

  currNumber = prevAns;
  numberScreen.value = currNumber; 
  addDecimal = true;
  
}

// Toggle a plus or minus in front of number
function togglePlusMinus() {

  if ( typeof currNumber == "number" ) {

  var stringNum = currNumber.toString();
  var arrNum = stringNum.split("");
  
  // Toggle between - and no -
  if ( arrNum[0] == "-") {
    arrNum.shift();
  } else {
   arrNum.unshift("-");

  } 
    	
  stringNum = arrNum.join("");
  currNumber = parseFloat(stringNum);
  
  // Show current number on number screen
  numberScreen.value = stringNum;  

  }
}

// Universal functions
// ______________________________________________


// Object that includes all operators on calclator
var findSum = {
  "+": function(a, b) { return a + b },
  "-": function(a, b) { return a - b },
  "/": function(a, b) { return a / b },
  "*": function(a, b) { return a * b },
  "√": function(a   ) { return Math.sqrt(a) },
  "%": function(a, b) { return a % b }
};

function resetValues() {
  // Reset current calc and current number
  currCalc = "";
  currNumber = "";
  // Reset calc screen
  calcScreen.value   =  currCalc;
  // Show total in numberScreen
  numberScreen.value = total; 
  prevOperator = undefined;
  addDecimal = true;
}

