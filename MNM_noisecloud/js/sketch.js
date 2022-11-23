let centerX;
let centerY;
let radius;
let totalDegrees = 350; //voor mooiste vormen rond 360 laten
let r;
let g;
let b;
let sliderOne, sliderTwo, sliderHoek, sliderRed, sliderGreen, sliderBlue;
let labelRed, labelGreen, labelBlue;
let labelCorner, labelSpeed;
let button;
let resetBtn;
let uploadBtn;

function setup(){
  createCanvas(windowWidth, 450);
  //noCursor();
  background(15);
  centerX = width / 2;
  centerY = height / 2;
  radius = height / 2;
  angleMode(DEGREES);
  r = random(255);
  g = random(255);
  b = random(255);

  labelSpeed = createDiv("Speed");
  labelCorner = createDiv("Corners")
  sliderOne = createSlider(100, 500, 500);
  sliderHoek = createSlider(10, 100, 100);
  sliderOne.parent(labelSpeed);
  sliderHoek.parent(labelCorner);
  sliderOne.addClass('glijder');
  sliderHoek.addClass('glijder');

  labelRed = createDiv('Red');
  sliderRed = createSlider(0, 255, 15);
  sliderRed.parent(labelRed);
  sliderRed.addClass('glijder');
  
  labelGreen = createDiv('Green');
  sliderGreen = createSlider(0, 255, 15);
  sliderGreen.parent(labelGreen);
  sliderGreen.addClass('glijder');

  labelBlue = createDiv('Blue');
  sliderBlue = createSlider(0, 255, 15);
  sliderBlue.parent(labelBlue);
  sliderBlue.addClass('glijder');
  
  button = createButton('Download');
  button.mousePressed(afbeeldingOpslaan);
  button.position(120, 745);

  resetBtn = createButton('Clear');
  resetBtn.mousePressed(opnieuw);
  resetBtn.position(220, 745);

  uploadBtn = createButton('Upload to Art-Space');
  uploadBtn.position(120, 790);
}

function draw(){
  let valOne = sliderOne.value();
  let valHoek = sliderHoek.value();

  noFill();

  stroke(sliderRed.value(), sliderGreen.value(), sliderBlue.value(), 55);

  //Als het naar het midden is geanimeerd, stoppen
  if(mouseIsPressed === true){
    beginShape();
    for(var i = 0; i <= totalDegrees; i++){
      //eerste getal in noise aapassen voor aantal hoeken, laatste getal aanpassen voor snelheid waarmee je ook in de vorm kunt veranderen
      var x = centerX + radius * cos(i) * noise(i / valHoek, frameCount / valOne); //noise(i / 10, frameCount / 120); = default
      //eerste getal in noise aapassen voor aantal hoeken, laatste getal aanpassen voor snelheid waarmee je ook in de vorm kunt veranderen 
      var y = centerY + radius * sin(i) * noise(i / valHoek, frameCount / valOne);
      vertex(x, y);
    }
    endShape(CLOSE);
  }  
  
}

function afbeeldingOpslaan() {
  save("name.png")
}

function opnieuw(){
  clear();
  background(15);
}

//document.addEventListener('contextmenu', event => event.preventDefault());