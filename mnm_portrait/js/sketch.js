let capture = null;
let tracker = null;
let positions = null;
let w = 0, h = 0;

let mouth = [44, 61, 60, 59, 50, 58, 57, 56];

let nose = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 33, 41, 62, 40, 39, 38, 43, 37, 42, 36, 35, 34];

let lips = [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55];

let jawline = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

let downloadButton, shareButton, resetButton;

function setup() {
  w = windowWidth;
  h = windowHeight;
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();


  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  frameRate(30);

  background(245, 242, 208);

  downloadButton = createButton("Capture & download");
  downloadButton.mousePressed(downloadImg);
  shareButton = createButton("Capture & upload to Art-Space gallery");

  resetButton = createButton("Clear Canvas");
  resetButton.mousePressed(clearCanvas);
}

function draw() {
  
  // Canvas spiegelen //
	translate(w, 0);
  scale(-1.0, 1.0);

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
    
    const irisColor = color(random(0,200), random(0, 200), random(0, 200));
    drawEye(eye1, irisColor);
		drawEye(eye2, irisColor);

    // Neus
    stroke(random(0,200), random(0, 200), random(0, 200))
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
    // stroke("#003770");
    // noFill();
    noStroke();
    fill(random(0,200), random(0, 200), random(0, 200));
    beginShape();
    for(let l = 0;  l < lips.length; l++) {
      let positionsIndexLips = lips[l];
      let lipsX = positions[positionsIndexLips][0];
      let lipsY = positions[positionsIndexLips][1];
      curveVertex(lipsX, lipsY);
    }
    endShape(CLOSE);

    // Mond //
    // stroke("#003770");
    // noFill();
    noStroke();
    fill(245, 242, 208);
    beginShape();
    for (let i = 0; i < mouth.length; i++){
        let positionsIndexMouth = mouth[i];
        let mouthX = positions[positionsIndexMouth][0];
        let mouthY = positions[positionsIndexMouth][1];
        curveVertex(mouthX,mouthY);
      }
    endShape(CLOSE);

    // Kaaklijn //
    // stroke("#003770");
    // noFill();
    // beginShape();
    // for(let k = 0; k < jawline.length; k++){
    //   let positionsIndexJawline = jawline[k];
    //   let jawlineX = positions[positionsIndexJawline][0];
    //   let jawlineY = positions[positionsIndexJawline][1];
    //   curveVertex(jawlineX, jawlineY);
    // }
    // endShape();
  }

}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function drawEye(eye, irisColor) {
  noFill();
  stroke(random(0,200), random(0, 200), random(0, 200));
  drawEyeOutline(eye);
  
  const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  const irisSize = irisRadius * 2;
  noStroke();
  fill(irisColor);
  ellipse(eye.center.x, eye.center.y, irisSize, irisSize);
  
  const pupilSize = irisSize / 3;
  fill(245, 242, 208);
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

function downloadImg() {
  save("portrait.png");
}

// Canvas wissen//
function clearCanvas(){
  window.location.reload();
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  background(5);
}