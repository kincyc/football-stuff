const field = document.querySelector(".field-container");
const leftInput = document.getElementById("leftInput");
const rightInput = document.getElementById("rightInput");
const leftSubmit = document.getElementById("leftSubmit");
const rightSubmit = document.getElementById("rightSubmit");
const clearButton = document.getElementById("clearButton");
const distanceDisplay = document.getElementById("distanceDisplay"); // Assuming you have an element to display distance
let greenMarker = null,
  redMarker = null,
  greenLabel = null,
  redLabel = null; // Track markers and labels
let greenYard = null,
  redYard = null,
  isGreenLeft = null,
  isRedLeft = null; // Track yard values and sides

const centerPixel = 306; // The center of the field (50-yard line) in pixels
const pixelsPerYard = 5.1; // Every yard corresponds to 5 pixels

// Function to create and position a marker
function createMarker(position, color, yard) {
  const marker = document.createElement("div");
  marker.classList.add("marker", color);
  marker.style.left = position + "px"; // Adjust for pixel precision
  marker.style.top = "0"; // Position at the top of the container
  marker.style.height = "100%";
  marker.style.width = "2px";
  marker.style.backgroundColor = color;
  marker.style.position = "absolute";
  field.appendChild(marker);

  // If it's the green or red marker, create a label for the yard
  if (color === "green") {
    createGreenLabel(position, yard);
  } else if (color === "red") {
    createRedLabel(position, yard);
  }

  return marker;
}

// Function to create and position the green yard label next to the green marker
function createGreenLabel(position, yard) {
  if (greenLabel) {
    greenLabel.remove();
  }

  greenLabel = document.createElement("div");
  greenLabel.classList.add("yard-label", "green-yard-label");
  greenLabel.innerText = yard + " yard line"; // Set the text for the yard value
  greenLabel.style.left = position + "px"; // Position the label with the marker
  field.appendChild(greenLabel);
}

// Function to create and position the red yard label next to the red marker
function createRedLabel(position, yard) {
  if (redLabel) {
    redLabel.remove();
  }

  redLabel = document.createElement("div");
  redLabel.classList.add("yard-label", "red-yard-label");
  redLabel.innerText = yard + " yard line"; // Set the text for the yard value
  redLabel.style.left = position + "px"; // Position the label with the marker
  field.appendChild(redLabel);
}

// Function to change the red marker and label to green
function changeRedToGreen() {
  if (redMarker) {
    // If there's already a green marker, remove it
    if (greenMarker) {
      greenMarker.remove();
      greenLabel.remove();
    }

    // Change the marker class from red to green
    redMarker.classList.remove("red");
    redMarker.classList.add("green");
    redMarker.style.backgroundColor = "green"; // Ensure the line color changes

    // Update the label class from red to green
    redLabel.classList.remove("red-yard-label");
    redLabel.classList.add("green-yard-label");

    // Set the greenMarker and greenLabel to the updated redMarker and redLabel
    greenMarker = redMarker;
    greenLabel = redLabel;

    // Transfer the red marker's yard value to the green marker
    greenYard = redYard;
    isGreenLeft = isRedLeft;

    // Clear redMarker and redLabel
    redMarker = null;
    redLabel = null;
    redYard = null;
  }
}

// Function to calculate the distance between the green and red markers
function calculateDistance() {
  if (greenYard !== null && redYard !== null) {
    let distance;
    if (isGreenLeft !== isRedLeft) {
      // Markers are on opposite sides
      distance = 50 - greenYard + (50 - redYard);
    } else {
      // Markers are on the same side
      distance = Math.abs(greenYard - redYard);
    }
    distanceDisplay.innerText = `Distance: ${distance} yards`;
  }
}

// Function to handle yard input
function handleYardSubmit(yard, isLeft) {
  // Validate yard value to be within 0 and 50
  if (!isNaN(yard) && yard >= 0 && yard <= 50) {
    // Calculate position based on which side (left or right) the input is from
    const position = isLeft
      ? centerPixel - (50 - yard) * pixelsPerYard // Left side
      : centerPixel + (50 - yard) * pixelsPerYard; // Right side

    // If there's already a red marker, change it to green
    changeRedToGreen();

    // Set the new red marker and its yard value
    redMarker = createMarker(position, "red", yard);
    redYard = yard;
    isRedLeft = isLeft;

    // Calculate distance once both markers are placed
    calculateDistance();
  } else {
    // Provide a message if the value is out of range
    alert("Please enter a yard value between 0 and 50.");
  }
}

// Clear the opposite input box
function clearOppositeInput(isLeft) {
  if (isLeft) {
    rightInput.value = ""; // Clear the right input box
  } else {
    leftInput.value = ""; // Clear the left input box
  }
}

// Clear the field and reset everything
clearButton.addEventListener("click", () => {
  if (greenMarker) greenMarker.remove();
  if (redMarker) redMarker.remove();
  if (greenLabel) greenLabel.remove();
  if (redLabel) redLabel.remove();
  greenMarker = null;
  redMarker = null;
  greenLabel = null;
  redLabel = null;
  greenYard = null;
  redYard = null;
  isGreenLeft = null;
  isRedLeft = null;
  distanceDisplay.innerText = `Distance: 0 yards`;
});

// Event listeners for submitting yard lines
leftSubmit.addEventListener("click", () => {
  const yard = parseInt(leftInput.value, 10); // Get the yard value
  handleYardSubmit(yard, true); // Handle left side submission
  clearOppositeInput(true); // Clear the right input box
});

rightSubmit.addEventListener("click", () => {
  const yard = parseInt(rightInput.value, 10); // Get the yard value
  handleYardSubmit(yard, false); // Handle right side submission
  clearOppositeInput(false); // Clear the left input box
});

// Add event listeners to respond to "Enter" key
leftInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const yard = parseInt(leftInput.value, 10);
    handleYardSubmit(yard, true);
    clearOppositeInput(true);
  }
});

rightInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const yard = parseInt(rightInput.value, 10);
    handleYardSubmit(yard, false);
    clearOppositeInput(false);
  }
});
