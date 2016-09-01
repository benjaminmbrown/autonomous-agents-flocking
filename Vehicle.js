var Vehicle = function(x, y) {
    this.acceleration = createVector(0, 0);
    //this.velocity = createVector(0, -2);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 3;
    this.maxSpeed = 5;
    this.maxForce = 0.02;
    this.mass = 155;

    this.wanderRadius = 19;
    this.wanderDistance = 4;
    this.wanderCenter = 0;
    this.wanderAngle = 0;
    this.wanderForce = createVector();
    this.separationRadius = 40;
    this.visionDepth = random(20,100);
    this.visionDegrees = random(10,160);//width of cone of vision


    var c = color(0, 0, random(x, y));

    this.run = function(vehicles) {
        this.flock(vehicles);
        this.update();
        this.borders();
        this.display();
    }


    this.manageBehaviors = function(vehicles) {

        var separationForce = this.separate(vehicles);
        var seekForce = this.seek(createVector(mouseX, mouseY));
        var alignForce = this.align(vehicles);
        var cohesionForce = this.cohesion(vehicles);

        separationForce.mult(2.5);
        seekForce.mult(0.5);
        alignForce.mult(1.0);
        cohesionForce.mult(1.0);

        this.applyForce(separationForce);
        this.applyForce(seekForce);
        this.applyForce(alignForce);
        this.applyForce(cohesionForce);

    }

    this.flock = function(vehicles) {
        var sep = this.separate(vehicles); // Separation
        var ali = this.align(vehicles); // Alignment
        var coh = this.cohesion(vehicles); // Cohesion
        var seekForce = this.seek(createVector(mouseX, mouseY));
        // Arbitrarily weight these forces
        sep.mult(1.25);
        ali.mult(1.5);
        coh.mult(1.0);
        seekForce.mult(0.5);

        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
      //  this.applyForce(seekForce);

    }

    this.cohesion = function(vehicles) {

        var neighborDistance = 250;
        var sum = createVector(0, 0);
        var count = 0;

        for (var i = 0; i < vehicles.length; i++) {
            var distance = p5.Vector.dist(this.position, vehicles[i].position);
            if ((distance > 10) && (distance < neighborDistance)) {
                sum.add(vehicles[i].position);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else {
            return createVector(0, 0);
        }

    }

    this.isTargetVisible = function(target) {
        //takes the position of this, and builds a cone of vision
        //returns true if target is in cone of vision
        //false if otherwise.
      //   var distance = p5.Vector.dist(this.position, target.position);
         var angle = p5.Vector.angleBetween(this.velocity, target.velocity);
         
         if((degrees(angle)>45)){
           // console.log("in vision", this.visionDegrees, this.visionDepth)
            return true
         }else {
            return false;
        }

    }

    this.align = function(vehicles) {
        var visionRadius = 30;
        var sum = createVector(0, 0);
        var count = 0;


        for (var i = 0; i < vehicles.length; i++) {
            var distance = p5.Vector.dist(this.position, vehicles[i].position);

            if ((distance > 0) && (this.isTargetVisible(vehicles[i]))) {
                sum.add(vehicles[i].velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);

            return this.steerTo(sum);
        } else {
            return createVector(0, 0);
        }
    }

    this.seek = function(target) {

        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);

        return this.steerTo(desired);
    }

    this.separate = function(vehicles) {
        var desiredSeparation = 35.0;
        var count = 0;
        var steer = createVector(0, 0);

        for (var i = 0; i < vehicles.length; i++) {
            var distance = p5.Vector.dist(this.position, vehicles[i].position);

            if ((distance > 0) && (distance < desiredSeparation)) {
                //vector pointing away from neighbor
                var diff = p5.Vector.sub(this.position, vehicles[i].position);
                diff.normalize();
                diff.div(distance);
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steer.div(count);
        }

        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }

        return steer;
    }

    this.followFlow = function(flowfield) {
        var desired = flowfield.lookup(this.position);
        desired.mult(this.maxSpeed);
        this.applyForce(this.steerTo(desired));
    }

    this.borders = function() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    this.steerTo = function(desired) {
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    this.setAngle = function(vector, value) {
        vector.x = cos(value) * vector.mag();
        vector.y = sin(value) * vector.mag();
    }

    this.wander = function() {

        this.wanderCenter = this.velocity.copy();
        this.wanderCenter.setMag(1);
        this.wanderCenter.mult(this.wanderDistance);

        var angleChange = 3

        var displacement = createVector(0, -1);
        displacement.mult(this.wanderRadius);

        this.setAngle(displacement, this.wanderAngle);
        this.wanderAngle += random(-.8, .8);

        this.wanderForce = this.wanderCenter.add(displacement);
        this.wanderForce.limit(this.maxForce);

        return this.wanderForce;

    }

    this.flee = function(target) {
        var desired = p5.Vector.sub(this.position, target);
        desired.setMag(1);

        return this.steerTo(desired);

    }

    this.predictSelfFuturePosition = function() {
        var predict = this.velocity.copy();
        predict.normalize();
        predict.mult(25); ///look 25 pixels ahead

        return p5.Vector.add(this.position, predict);
    }

    this.getFuturePosition = function(target) {

        var lookahead = p5.Vector.dist(target.position, this.position) / this.maxSpeed;
        var futurePosition = target.position.copy();
        var futureVelocity = target.velocity.copy();

        futureVelocity.mult(lookahead);
        futurePosition.add(futureVelocity);

        return futurePosition;
    }

    this.getNormalPoint = function(predicted, a, b) {

        var aToP = p5.Vector.sub(predicted, a);
        var aToB = p5.Vector.sub(b, a);

        aToB.normalize(); //dot product for scalar
        aToB.mult(aToP.dot(aToB));

        return p5.Vector.add(a, aToB); //this is the normal point

    }

    this.followPath = function(p) {


        var predict = this.velocity.copy();
        predict.normalize();
        predict.mult(50);
        var predictLoc = p5.Vector.add(this.position, predict);

        var normal = null;
        var target = null;
        var record = 1000000;
        for (var i = 0; i < p.points.length - 1; i++) {

            var a = p.points[i];
            var b = p.points[i + 1];

            var normalPoint = this.getNormalPoint(predictLoc, a, b);

            if (normalPoint.x < a.x || normalPoint.x > b.x) {
                normalPoint = b.copy();
            }

            var distance = p5.Vector.dist(predictLoc, normalPoint);


            if (distance < record) {
                record = distance;
                normal = normalPoint;

                var dir = p5.Vector.sub(b, a);
                dir.normalize();
                dir.mult(10);
                target = normal.copy();
                target.add(dir);
            }
        }

        if (record > p.radius && target !== null) {
            this.seek(target);
        }

        //draw line
        fill(200);
        stroke(200);
        line(this.position.x, this.position.y, predictLoc.x, predictLoc.y);
        ellipse(predictLoc.x, predictLoc.y, 4, 4);

        // Draw normal location
        fill(200);
        stroke(200);
        line(predictLoc.x, predictLoc.y, normal.x, normal.y);
        ellipse(normalPoint.x, normalPoint.y, 4, 4);
        stroke(200);
        if (distance > p.radius) fill(255, 0, 0);
        noStroke();
        ellipse(target.x + dir.x, target.y + dir.y, 8, 8);

    }

    this.pursue = function(target) {
        this.seek(this.getFuturePosition(target));
    }

    this.evade = function(target) {
        this.flee(this.getFuturePosition(target));
    }

    this.arrive = function(target) {
        var desired = p5.Vector.sub(target, this.position);
        var distance = desired.mag();
        if (distance < 100) {
            var scaledSpeed = map(distance, 0, 100, 0, this.maxSpeed);
            desired.setMag(scaledSpeed);
        } else {
            desired.setMag(this.maxSpeed)
        }

        this.applyForce(this.steerTo(desired));
    }

    this.boundaries = function() {

        var desired = null;
        var d = 25;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            this.applyForce(this.steerTo(desired));
        }
    };

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }

    this.display = function() {
        var theta = this.velocity.heading() + PI / 2;

        fill(c);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        ellipse(this.x, this.y, 8, 8);
        endShape(CLOSE);
        ellipse(this.x, this.y, 8, 8);
        pop();
    }
}
