var Flock = function(vehicles) {
   
	this.vehicleFlock = [];
	this.flowField;


	this.run = function(){
		for(var i = 0; i<this.vehicleFlock.length; i++){
			this.vehicleFlock[i].run(this.vehicleFlock,this.flowField);
			if(this.flowField){
					this.vehicleFlock[i].followFlow(flowField);
			}
		
		}
	}

	this.addVehicle = function(vehicle){
		console.log('adding vehicle');
		this.vehicleFlock.push(vehicle);
	}

	this.addFlowfield = function(flowField){
		this.flowField = flowField;

	}

}
