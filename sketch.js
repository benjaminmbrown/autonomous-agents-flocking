var vehicles = [];
var flock;
var debug ;

function setup() {

    createCanvas(1020, 680);
    setFrameRate(50);
    flock = new Flock();

    // for (var i = 0; i < 30; i++) {
    //     var v = new Vehicle(width/2, height/2);
    //     flock.addVehicle(v);
    // }
}

function draw() {
    background(255);
    flock.run();
}

function keyPressed() {

    for (var i = 0; i < key; i++) {
        flock.addVehicle(new Vehicle(random(width), random(height), random(2, 3), random(0.02, 0.02), width, height));
    }
    if (key == 'K') {
        console.log("pressed");
        vehicles.push(new Vehicle(random(width), random(height), random(2, 5), random(0.2, 0.4), width, height));
        debug != debug;
    }

}
