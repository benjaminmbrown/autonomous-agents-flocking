var Flock = function(vehicles) {
   
	this.vehicleFlock = [];

	this.run = function(){
		for(var i = 0; i<this.vehicleFlock.length; i++){
			this.vehicleFlock[i].run(this.vehicleFlock);
		}
	}

	this.addVehicle = function(vehicle){
		this.vehicleFlock.push(vehicle);
	}

}
