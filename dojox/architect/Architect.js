define("dojox/architect/Architect", [
	"dojo", 
	"dijit/_Widget", 
	"dojox/architect/_Frontend"], function(dojo) {

	return dojo.declare("dojox.architect.Architect", dijit._Widget, {
		_frontend: null,
		
		constructor:function(){
			this._frontend = null;
		},
		postCreate:function(){
			this.inherited(arguments);
			
			// setup the frontend
			this._frontend = new dojox.architect._Frontend();
			this._frontend.placeAt(this.domNode);
		},
		startup:function(){
			this._frontend.startup();
		}
	});
	
});