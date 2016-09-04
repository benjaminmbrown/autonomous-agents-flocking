var vehicles = [];
var flock;
var predators =[];
var debug ;
var flowField;

function setup() {

    createCanvas(650, 450);
    setFrameRate(50);
    flock = new Flock();
    predators = new Flock();
    flowField = new Flowfield(25);
    flowField.init();

    var type= 1;
   
    for (var i = 0; i < 30; i++) {
        var v = new Vehicle(width/2, height/2, type);
        flock.addVehicle(v);
    }
    flock.addFlowfield(flowField);
}

function draw() {
    background(255);
    flock.run();
    predators.run();

    flowField.display()
}

function mouseDragged(){
    flock.addVehicle(new Vehicle(mouseX, mouseY,1));
}

function keyPressed() {

    for (var i = 0; i < key; i++) {
        predators.addVehicle(new Vehicle(width/2, height/2));
    }

 

}
