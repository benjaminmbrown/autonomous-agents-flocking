var Flock = function(vehicles) {
   
	this.vehicleFlock = [];


	this.run = function(){
		for(var i = 0; i<this.vehicleFlock.length; i++){
			this.vehicleFlock[i].run(this.vehicleFlock,this.flowField);
		
		
		}
	}

	this.addVehicle = function(vehicle){
		console.log('adding vehicle');
		this.vehicleFlock.push(vehicle);
	}



}
