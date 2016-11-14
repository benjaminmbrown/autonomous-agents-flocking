var vehicles = [];
var flock;
var predators =[];
var debug ;

function setup() {

    createCanvas(1000, 800);
    setFrameRate(50);
    flock = new Flock();
    predators = new Flock();


    var type= 1;
   
    for (var i = 0; i < 30; i++) {
        var v = new Vehicle(width/2, height/2, type);
        flock.addVehicle(v);
    }

}

function draw() {
    background(255);
    flock.run();
    predators.run();
    
}

function mouseDragged(){
    flock.addVehicle(new Vehicle(mouseX, mouseY,1));
}

function keyPressed() {
    for (var i = 0; i < key; i++) {
        predators.addVehicle(new Vehicle(width/2, height/2));
    }

}
