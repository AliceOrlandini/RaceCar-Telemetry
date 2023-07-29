/**
 * In this file, there are functions for the removal and insertion of 
 * information blocks on the file_input.html page.
 */

var isSpeedometerSelected = true;
var isInfocarSelected = true;
var isCircuitSelected = true;
var isRPMGraphSelected = true;
var isForwardVelGraphSelected = true;
var isGearGraphSelected = true;
var isThrottleGraphSelected = true;
var isBrakeGraphSelected = true;
var isFirstRowSelected = true;
var isSecondRowSelected = true;

/**
 * Function to show or hide a block.
 */
function changeBlockStatus(id) {

  const element = document.getElementById(id);
  switch(id) {
    case 'speedometer-block':
      if(isSpeedometerSelected) {
        element.style.display = 'none';
        isSpeedometerSelected = false;
      } else {
        element.style.display = '';
        isSpeedometerSelected = true;
        checkFirstRow();
      }
      break;
    case 'infocar-block':
      if(isInfocarSelected) {
          element.style.display = 'none';
          isInfocarSelected = false;
      } else {
          element.style.display = ''; 
          isInfocarSelected = true;
          checkFirstRow();
      }
      break;
    case 'circuit-block':
      if(isCircuitSelected) {
          element.style.display = 'none';
          isCircuitSelected = false;
      } else {
          element.style.display = ''; 
          isCircuitSelected = true;
          checkFirstRow();
      }
      break;
    case 'rpm-graph-block':
      if(isRPMGraphSelected) {
          element.style.display = 'none';
          isRPMGraphSelected = false;
      } else {
          element.style.display = '';
          isRPMGraphSelected = true;
          checkSecondRow();
      }
      break;
    case 'forward_vel-graph-block':
      if(isForwardVelGraphSelected) {
          element.style.display = 'none';
          isForwardVelGraphSelected = false;
      } else {
          element.style.display = '';
          isForwardVelGraphSelected = true;
          checkSecondRow();
      }
      break;
    case 'gear-graph-block':
      if(isGearGraphSelected) {
          element.style.display = 'none';
          isGearGraphSelected = false;
      } else {
          element.style.display = '';
          isGearGraphSelected = true;
          checkSecondRow();
      }
      break;
    case 'throttle-graph-block':
      if(isThrottleGraphSelected) {
          element.style.display = 'none';
          isThrottleGraphSelected = false;
      } else {
          element.style.display = '';
          isThrottleGraphSelected = true;
          checkSecondRow();
      }
      break;
    case 'brake-graph-block':
      if(isBrakeGraphSelected) {
          element.style.display = 'none';
          isBrakeGraphSelected = false;
      } else {
          element.style.display = '';
          isBrakeGraphSelected = true;
          checkSecondRow();
      }
      break;
  }

  // in this case, I hide the entire first row otherwise it would take up space
  if(!isSpeedometerSelected && !isCircuitSelected && !isInfocarSelected) {
    document.getElementById("first-row").style.display = 'none';
    isFirstRowSelected = false;
  }

  // In this case, I hide the entire second row otherwise it would take up space
  if(!isRPMGraphSelected && !isForwardVelGraphSelected && !isGearGraphSelected  && !isThrottleGraphSelected  && !isBrakeGraphSelected) {
    document.getElementById("second-row").style.display = 'none';
    isSecondRowSelected = false;
  }
}

/**
 * Function used to check if the first row is disabled, and if so, enable it.
 */
function checkFirstRow() {
  if(!isFirstRowSelected) {
    document.getElementById("first-row").style.display = '';
    isFirstRowSelected = true;
  }
}

/**
 * Function used to check if the second row is disabled, and if so, enable it.
 */
function checkSecondRow() {
  if(!isSecondRowSelected) {
    document.getElementById("second-row").style.display = '';
    isSecondRowSelected = true;
  }
}