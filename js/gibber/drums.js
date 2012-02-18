/* 	
Charlie Roberts 2012 MIT License

Requires gibber.js.

x = kick
o = snare
* = closed hat

Usage: d = Drums("x*o*x*o*");

I don't know what happened here but the prototype inheritance was completely jacked... had to go to creating an object
and manually assigning __proto__.

*/
// (function myPlugin(){
// 
// function initPlugin(audioLib){
// (function(audioLib){

function _Drums (_sequence, _timeValue, _mix, _freq){
	that = {
		sampleRate : Gibber.sampleRate,
		type  : "gen",
		name  : "Drums",
		value : 0,
		active : true,
		mods : [],
		fx : [],
		sequenceInit:false,
		automations : [],
		initialized : false,
		
		load : function (){
			// SAMPLES ARE PRELOADED IN GIBBER CLASS
			this.kick.loadWav(Gibber.samples.kick);
			this.snare.loadWav(Gibber.samples.snare);
			this.hat.loadWav(Gibber.samples.snare); // TODO: CHANGE TO HIHAT SAMPLE
			
			this.initialized = true;
		},
	
		generate : function() {
			this.value = 0;
			if(!this.initialized) {
				return;
			}
			
			this.kick.generate();
			this.value += this.kick.getMix();

			this.snare.generate();
			this.value += this.snare.getMix();
			
			this.hat.generate();
			this.value += this.hat.getMix();
		},
		
		getMix : function() { return this.value; },
	};
	
	if(typeof _sequence != undefined) {
		that.seq = Seq(_sequence, _timeValue, that);
	}
	
	that.kick  = new audioLib.Sampler(Gibber.sampleRate);
	that.snare = new audioLib.Sampler(Gibber.sampleRate);		
	that.hat   = new audioLib.Sampler(Gibber.sampleRate);
	that.mix   = isNaN(_mix) ? 0.175 : _mix;
	that.frequency = isNaN(_freq) ? 440 : _freq;
	
	that.shuffle = function() { this.seq.shuffle(); }
	that.set = function(newSequence) { this.seq.set(newSequence); }
	that.reset = function(num)  { this.seq.reset(num); }
	that.retain = function(num) { this.seq.retain(num); }
	
	that.note = function(nt) {
		switch(nt) {
			case "x":
				this.kick.noteOn(this.frequency);
				break;
			case "o":
				this.snare.noteOn(this.frequency);
				break;
			case "*":
				this.hat.noteOn(this.frequency * 3.5);
				break;
			default: break;
		}
	}
	
	function bpmCallback() {
		return function(percentageChangeForBPM) {
			that.timeValue *= percentageChangeForBPM;
			that.patternLengthInSamples = that.sequence.length * that.timeValue;
			that.setSequence(that.sequence);
		}
	}
	
	Gibber.registerObserver("bpm", bpmCallback.call(that));
	Gibber.addModsAndFX.call(that);
	Gibber.generators.push(that);
	
	that.__proto__ = new audioLib.GeneratorClass();
	
	return that;
}

// Drums.prototype = {
// 
// }

//_Drums.prototype.__proto__ = new audioLib.GeneratorClass();

//audioLib.generators('Drums', Drums);

// audioLib.Drums = audioLib.generators.Drums;
// 
// }(audioLib));
// audioLib.plugins('Drums', myPlugin);
// }
// 
// if (typeof audioLib === 'undefined' && typeof exports !== 'undefined'){
// 	exports.init = initPlugin;
// } else {
// 	initPlugin(audioLib);
// }
// 
// }());

function Drums (_sequence, _timeValue, _mix, _freq) {
	var d = _Drums(_sequence, _timeValue, _mix, _freq);
	d.load();
	return d;
}