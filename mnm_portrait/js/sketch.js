let capture = null;
let tracker = null;
let positions = null;
let w = 0, h = 0;
let slider;

let colorPicker, colorPickerFace;
let labelBgc, labelFc, labelThickness;
let controls;

let nextBtn;

let mouth = [44, 61, 60, 59, 50, 58, 57, 56];

let nose = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 33, 41, 62, 40, 39, 38, 43, 37, 42, 36, 35, 34];

let lips = [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55];

let eyebrow = [0, 19, 20, 21, 22, 33];

function setup() {
  w = windowWidth;
  h = windowHeight;
  capture = createCapture(VIDEO);
  createCanvas(w, 350);
  capture.size(w, 350);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  frameRate(60);

  controls = createDiv();
  controls.addClass("controls");

  labelBgc = createP("Background color");
  labelBgc.position(160, 470);
  colorPicker = createColorPicker('#FFFFFF');
  colorPicker.position(90, 485);

  labelFc = createP("Face color");
  labelFc.position(160, 505);
  colorPickerFace = createColorPicker('#003770');
  colorPickerFace.position(90, 520);

  labelThickness = createP("Thickness");
  labelThickness.position(160, 540)
  slider = createSlider(1, 7, 1);
  slider.position(130, 585);

  nextBtn = createButton("Next");
  nextBtn.position(100, 620);

  labelBgc.parent(controls);
  colorPicker.parent(controls);
  labelFc.parent(controls);
  colorPickerFace.parent(controls);
  labelThickness.parent(controls);
  slider.parent(controls);
  nextBtn.parent(controls);

  
}

function draw() {
  
  // Canvas spiegelen //
	translate(w, 0);
  scale(-1.0, 1.0);

  background(colorPicker.color());

  // Uncomment code hieronder om jezelf in camera te zien //
  // image(capture, 0, 0, w, h);
  positions = tracker.getCurrentPosition();

  if (positions.length > 0) {

    // Ogen //
    const eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    };
    const eye2 = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    }
    
    const irisColor = colorPickerFace.color();
    drawEye(eye1, irisColor);
		drawEye(eye2, irisColor);

    // Neus
    stroke(colorPickerFace.color());
    strokeWeight(slider.value());
    noFill();
    beginShape();
    for(let n = 0; n < nose.length; n++){
      let positionsIndexNose = nose[n];
      let noseX = positions[positionsIndexNose][0];
      let noseY = positions[positionsIndexNose][1];
      curveVertex(noseX, noseY);
    }
    endShape();

    // Lippen //
    stroke(colorPickerFace.color());
    fill(colorPickerFace.color());
    beginShape();
    for(let l = 0;  l < lips.length; l++) {
      let positionsIndexLips = lips[l];
      let lipsX = positions[positionsIndexLips][0];
      let lipsY = positions[positionsIndexLips][1];
      curveVertex(lipsX, lipsY);
    }
    endShape(CLOSE);

    // Mond //
    stroke(colorPickerFace.color());
    fill(colorPicker.color());
    beginShape();
    for (let i = 0; i < mouth.length; i++){
        let positionsIndexMouth = mouth[i];
        let mouthX = positions[positionsIndexMouth][0];
        let mouthY = positions[positionsIndexMouth][1];
        curveVertex(mouthX,mouthY);
      }
    endShape(CLOSE);

    // Wenkbrauw //

    stroke(colorPickerFace.color());
    noFill();
    beginShape();
    for (let e = 0; e < eyebrow.length; e++){
      let positionsIndexEyebrow = eyebrow[e];
      let eyebrowX = positions[positionsIndexEyebrow][0];
      let eyebrowY = positions[positionsIndexEyebrow][1];
      curveVertex(eyebrowX, eyebrowY);
    }
    endShape();
  }

}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function drawEye(eye, irisColor) {
  noFill();
  stroke(colorPickerFace.color());
  drawEyeOutline(eye);
  
  const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  const irisSize = irisRadius * 2;
  noStroke();
  fill(irisColor);
  ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  
  const pupilSize = irisSize / 3;
  fill(colorPicker.color());
  ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
}

function drawEyeOutline(eye) {
	beginShape();
  const firstPoint = eye.outline[0];
  eye.outline.forEach((p, i) => {
    curveVertex(p.x, p.y);
    if (i === 0) {
      curveVertex(firstPoint.x, firstPoint.y);
    }
    if (i === eye.outline.length - 1) {
      curveVertex(firstPoint.x, firstPoint.y);
      curveVertex(firstPoint.x, firstPoint.y);
    }
  });
  endShape();
}