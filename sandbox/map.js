
	var ISO_ANGLE = 54.7364;

function newTile() {
	return document.createElement("tile");
}

function Game() {
	var self = this;
	
	var xSize = 5;
	var ySize = 5;
	
	plane = document.getElementById("map");
	this.loadMap = function() {
		
		for(var i=0;i<5;i++) {
			col = document.createElement("div");
				col.className="col";
			for(var j=0;j<5;j++) {
				col.appendChild(newTile());
			}
			plane.appendChild(col);
			console.log(col);
		}
	}
}
Game = new Game();
Game.loadMap();
	window.addEventListener('click', function(e) {
		if (e.target.tagName == "TILE") {
		    e.target.appendChild(makeSide("east"));
			e.target.appendChild(makeSide("north"));
			e.target.appendChild(makeSide("south"));
			e.target.appendChild(makeSide("west" ));
			e.target.style["-webkit-transform"] = "translateZ(20px)";    
			console.log(e.target);
		}
  	});
	
	function makeSide(dir,size) {
		var side = document.createElement("side");
		side.className=dir;
		side.style.height = "20px";
		return side;
	}


	function Camera(x,y,z,angle,pitch) {
		var self = this;
		 
		
		this.xVal = x;
		this.yVal = y;
		this.zVal = z;
		this.angleVal = angle;
		this.pitchVal = pitch;
		
		this.update = function() {
			document.getElementById('map').style["-webkit-transform"] = "rotateX("+self.pitchVal+"deg) rotateZ("+self.angleVal+"deg) translateX(" + (-self.xVal) + "px) translateY(" + (-self.yVal) + "px) translateZ(" + (-(self.zVal)) + "px)";
		}
		var u = this.update;
		this.moveA = function(x, y, z,angle,pitch) {
			self.xVal = (x == undefined ? self.xVal : x);
			self.yVal = (y == undefined ? self.yVal : y);
			self.zVal = (z == undefined ? self.zVal : z);
			self.angleVal = (angle == undefined ? self.angle : angle);
			self.pitchVal = (pitch == undefined ? self.pitch : pitch);
			u();
			//document.getElementById('map').style["-webkit-transform"] = "rotateX("+self.pitch+"deg) rotateZ("+self.angle+"deg) translateX(" + (-self.x) + "px) translateY(" + (-self.y) + "px) translateZ(" + (-(self.z)) + "px)";
					}
		
		
		Object.defineProperty(this, "x", 
			{get: function(){ return self.xVal; },
			set: function(newValue) {
				self.xVal=newValue;
		 		u();
			},
			 configurable : true});
		Object.defineProperty(this, "y", 
			{get: function(){ return self.yVal; },
			set: function(newValue) {
				self.yVal=newValue;
		 		u();
			},
			 configurable : true});
		Object.defineProperty(this, "z", 
			{get: function(){ return self.zVal; }, 
			set: function(newValue) {
				self.zVal=newValue;
		 		u();
			},
			 configurable : true});
		Object.defineProperty(this, "angle", 
			{get: function(){ return self.angleVal; },
			set: function(newValue) {
				self.angleVal=newValue;
		 		u();
			},
			 configurable : true});
		Object.defineProperty(this, "pitch", 
			{get: function(){ return self.pitchVal; },
			set: function(newValue) {
				self.pitchVal=newValue;
		 		u();
			},
			 configurable : true});
		this.moveR = function(x,y,z) {
			self.moveA(self.xVal+x,self.yVal+y,self.zVal+z);
			
		}
		this.move = function(x,y,z) {
		    var a = -Math.PI/180*self.angleVal;
		    var p = Math.PI/180*self.pitchVal;
			self.moveR(x*Math.cos(a) - y*(1/Math.cos(p))* Math.sin(a), y * Math.cos(a) * (1/Math.cos(p)) + x * Math.sin(a),0);
		}
	}
	var Camera = new Camera(500,500,500,45,ISO_ANGLE);
	
function keyCatch(keyEvent) {
	//If they pressed left
	delta = 100
	if(keyEvent.keyCode == 37) {
		Camera.move(-delta,0,0);
	}

	//If they pressed up
	if(keyEvent.keyCode == 38) {
		Camera.move(0,-delta,0);
	}

	//If they pressed right
	if(keyEvent.keyCode == 39) {
		Camera.move(delta,0,0);
	}

	//If they pressed down
	if(keyEvent.keyCode == 40) {
		Camera.move(0,delta,0);
	}
}