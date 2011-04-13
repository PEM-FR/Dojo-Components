define("dojox/architect/_Wrapper", [
	"dojo", 
	"dijit/_Widget",
	"dojox.architect.dnd.Area"], function(dojo) {

	return dojo.declare("dojox.architect._Wrapper", [dijit._Widget], {
		
		dndArea: true,
		
		postCreate:function(){
			this.inherited(arguments);
			
			if(this.dndArea === true){
				new dojox.architect.dnd.Area({target: this.domNode});
			}
		}
	});
});