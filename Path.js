var Path = function(width, height) {

    this.radius = 15;
    this.start = createVector(0, height / 3);
    this.end = createVector(width, 2 * height / 3);
    this.points = [];

    this.addPoint = function(x, y) {
        var point = createVector(x, y);
        this.points.push(point);
    }

    this.getPathStart = function() {
        return this.points[0];
    }

    this.getPathEnd = function(){
        return this.points[this.points.length-1];
    }


    this.init = function() {

        this.start = createVector(random(0, height), random(0, height));
        this.end = createVector(random(0, width), random(0, width));
    }

    this.display = function() {
        stroke(0);
        noFill();
        beginShape();
        for (var i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x,this.points[i].y);
        }
        endShape();
        stroke(255);
        strokeWeight(1);
        noFill();

        beginShape();
        for(var i = 0; i<this.points.length; i++){
            vertex(this.points[i].x,this.points[i].y);
        }
        endShape();
    }
}
