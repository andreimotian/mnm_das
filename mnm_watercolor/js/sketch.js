let defaultTime = 0.0012; // large = quick dry
let runnyColors = false;
let backgrd = 245;
let state;
let thickness;
dryTime = defaultTime;
let prevMouseX, prevMouseY;
let sliderDrops, buttonDry, buttonWet, buttonDefault, resetButton, downloadButton, shareButton;
let labels;
let colorPicker;
let colorPicked;
let paint = [];
let tempPaint1 = [];
let tempPaint2 = [];

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, 450)
  background(245);
  colorPicker = createColorPicker("#000000");
  colorPicker.position(60, height + 160);
  sliderDrops = createSlider(5, 100, 20);
  sliderDrops.position(200, height + 165);
  sliderDrops.addClass('slider');
  buttonDry = createButton("Dry");
  buttonDry.position(60, height + 50);
  buttonWet = createButton("Wet");
  buttonWet.position(125, height + 50);
  buttonDefault = createButton("Moist");
  buttonDefault.position(190, height + 50);
  resetButton = createButton("Clear canvas")
  resetButton.position(270, height + 50);
  resetButton.mousePressed(clearCanvas);
  downloadButton = createButton("Download");
  downloadButton.position(60, height + 240);
  downloadButton.mousePressed(downloadImg);
  shareButton = createButton("Upload to Art-Space gallery");
  shareButton.position(170, height + 240);
  state = createElement("state", "Pencil: Moist");
  state.position(60, height + 110);
  

  // fill the arrays with white color
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      paint.push(backgrd, backgrd, backgrd, 0);
    }
  }
  tempPaint1 = paint; 
  tempPaint2 = paint;
}

function draw() {
  buttonDry.mousePressed(dry);
  buttonWet.mousePressed(wet);
  buttonDefault.mousePressed(defaultDry);
  paintDrop = sliderDrops.value();
  colorPicked = colorPicker.color();
  addPaint();
  update();
  render();
}

function dry() {
  dryTime = 1000;
  state.html("Pencil: Dry");
}
function wet() {
  dryTime = 0.0001;
  state.html("Pencil: Wet");
}
function defaultDry() {
  dryTime = defaultTime;
  state.html("Pencil: Moist");
}

// Doe er verf bij als er geklikt wordt
function addPaint() {
  if (
    mouseIsPressed &&
    mouseX >= 0 &&
    mouseX <= width &&
    mouseY >= 0 &&
    mouseY <= height
  ) {
    let distance = dist(prevMouseX, prevMouseY, mouseX, mouseY);
    let numPoints = floor(distance / 1); 
    drawLinePoints(prevMouseX, prevMouseY, mouseX, mouseY, numPoints);

    // add paint when clicking in one place
    if (mouseX == prevMouseX && mouseY == prevMouseY) {
      renderPoints(mouseX, mouseY);
    }
  }
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  if (mouseIsPressed && mouseX < 0) {
    prevMouseX = 0;
  }
  if (mouseIsPressed && mouseX > width - 1) {
    prevMouseX = width - 1;
  }
  if (mouseIsPressed && mouseY < 0) {
    prevMouseY = 0;
  }
  if (mouseIsPressed && mouseY > height - 1) {
    prevMouseY = height - 1;
  }
}

// reken punten uit tijdens tekenen
function drawLinePoints(x1, y1, x2, y2, points) {
  for (let i = 0; i < points; i++) {
    let t = map(i, 0, points, 0.0, 1.0);
    let x = round(lerp(x1, x2, t));
    let y = round(lerp(y1, y2, t));
    renderPoints(x, y);
  }
}

// vervang array punten als je tekent
function renderPoints(x, y) {
  let arrayPos = (x + y * width) * 4;
  let newR = (paint[arrayPos + 0] + colorPicked.levels[0]) / 2;
  let newG = (paint[arrayPos + 1] + colorPicked.levels[1]) / 2;
  let newB = (paint[arrayPos + 2] + colorPicked.levels[2]) / 2;
  let newN = paint[arrayPos + 3] + paintDrop;
  paint.splice(arrayPos, 4, newR, newG, newB, newN); // replace the current pixel color with the newly calculated color
}

// Als er veel kleur op een plek is, verspreiden
function update() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let arrayPos = (x + y * width) * 4;
      if (paint[arrayPos + 3] > 4) {
        tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - 4;

        // mix met pixel rechts
        if (x < width - 1) {
          tempPaint1[arrayPos + 4] =
            (paint[arrayPos + 4] + paint[arrayPos]) / 2;
          tempPaint1[arrayPos + 5] =
            (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
          tempPaint1[arrayPos + 6] =
            (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
          tempPaint1[arrayPos + 7] = paint[arrayPos + 7] + 1;
        }

        // mix met pixel links
        if (x > 0) {
          tempPaint1[arrayPos - 4] =
            (paint[arrayPos - 4] + paint[arrayPos]) / 2;
          tempPaint1[arrayPos - 3] =
            (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
          tempPaint1[arrayPos - 2] =
            (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
          tempPaint1[arrayPos - 1] = paint[arrayPos - 1] + 1;
        }

        // mix met pixel onder
        tempPaint1[arrayPos + width * 4] =
          (paint[arrayPos + width * 4] + paint[arrayPos]) / 2;
        tempPaint1[arrayPos + width * 4 + 1] =
          (paint[arrayPos + width * 4 + 1] + paint[arrayPos + 1]) / 2;
        tempPaint1[arrayPos + width * 4 + 2] =
          (paint[arrayPos + width * 4 + 2] + paint[arrayPos + 2]) / 2;
        tempPaint1[arrayPos + width * 4 + 3] =
          paint[arrayPos + width * 4 + 3] + 1;

        // mix pixel above
        tempPaint1[arrayPos - width * 4] =
          (paint[arrayPos - width * 4] + paint[arrayPos]) / 2;
        tempPaint1[arrayPos - width * 4 + 1] =
          (paint[arrayPos - width * 4 + 1] + paint[arrayPos + 1]) / 2;
        tempPaint1[arrayPos - width * 4 + 2] =
          (paint[arrayPos - width * 4 + 2] + paint[arrayPos + 2]) / 2;
        tempPaint1[arrayPos - width * 4 + 3] =
          paint[arrayPos - width * 4 + 3] + 1;
      }

      // gradually dry paint
      tempPaint1[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
      if (tempPaint1[arrayPos + 3] < 0) {
        tempPaint1[arrayPos + 3] = 0;
      }
    }
  }
  
  if (runnyColors == true){
    paint = tempPaint1;
  }
    else {
  for (let x = width; x > 0; x--) {
    for (let y = height; y > 0; y--) {
      let arrayPos = (x + y * width) * 4;
      if (paint[arrayPos + 3] > 4) {
        tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - 4;

        // mix pixel to right
        if (x < width - 1) {
          tempPaint2[arrayPos + 4] =
            (paint[arrayPos + 4] + paint[arrayPos]) / 2;
          tempPaint2[arrayPos + 5] =
            (paint[arrayPos + 5] + paint[arrayPos + 1]) / 2;
          tempPaint2[arrayPos + 6] =
            (paint[arrayPos + 6] + paint[arrayPos + 2]) / 2;
          tempPaint2[arrayPos + 7] = paint[arrayPos + 7] + 1;
        }

        // mix pixel to left
        if (x > 0) {
          tempPaint2[arrayPos - 4] =
            (paint[arrayPos - 4] + paint[arrayPos]) / 2;
          tempPaint2[arrayPos - 3] =
            (paint[arrayPos - 3] + paint[arrayPos + 1]) / 2;
          tempPaint2[arrayPos - 2] =
            (paint[arrayPos - 2] + paint[arrayPos + 2]) / 2;
          tempPaint2[arrayPos - 1] = paint[arrayPos - 1] + 1;
        }

        // mix pixel below
        tempPaint2[arrayPos + width * 4] =
          (paint[arrayPos + width * 4] + paint[arrayPos]) / 2;
        tempPaint2[arrayPos + width * 4 + 1] =
          (paint[arrayPos + width * 4 + 1] + paint[arrayPos + 1]) / 2;
        tempPaint2[arrayPos + width * 4 + 2] =
          (paint[arrayPos + width * 4 + 2] + paint[arrayPos + 2]) / 2;
        tempPaint2[arrayPos + width * 4 + 3] =
          paint[arrayPos + width * 4 + 3] + 1;

        // mix pixel above
        tempPaint2[arrayPos - width * 4] =
          (paint[arrayPos - width * 4] + paint[arrayPos]) / 2;
        tempPaint2[arrayPos - width * 4 + 1] =
          (paint[arrayPos - width * 4 + 1] + paint[arrayPos + 1]) / 2;
        tempPaint2[arrayPos - width * 4 + 2] =
          (paint[arrayPos - width * 4 + 2] + paint[arrayPos + 2]) / 2;
        tempPaint2[arrayPos - width * 4 + 3] =
          paint[arrayPos - width * 4 + 3] + 1;
      }

      // gradually dry paint
      tempPaint2[arrayPos + 3] = paint[arrayPos + 3] - dryTime;
      if (tempPaint2[arrayPos + 3] < 0) {
        tempPaint2[arrayPos + 3] = 0;
      }
    }
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let arrayPos = (x + y * width) * 4;
      paint[arrayPos] = (tempPaint1[arrayPos] + tempPaint2[arrayPos]) / 2;
    }
  }
}
}

// render alle pixels
function render() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pix = (x + y * width) * 4;
      let arrayPos = (x + y * width) * 4;
      pixels[pix] = paint[arrayPos];
      pixels[pix + 1] = paint[arrayPos + 1];
      pixels[pix + 2] = paint[arrayPos + 2];
    }
  }
  updatePixels();
}

// Opslaan als png
function downloadImg() {
  save("watercolor_painting.png")
}

// Canvas wissen
function clearCanvas(){
window.location.reload();
}