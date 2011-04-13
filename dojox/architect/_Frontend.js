define("dojox/architect/_Frontend", [
	"dojo", 
	"dijit/_Widget", 
	"dijit/_Templated", 
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dijit/layout/AccordionContainer",
	"dijit.Toolbar",
	"dijit.form.Button",
	"dojox/architect/_Wrapper",
	"dojox/architect/wrapped/dijit/layout/ContentPane",
	"dojox.architect.dnd.Area"], function(dojo) {

	return dojo.declare("dojox.architect._Frontend", [dijit._Widget, dijit._Templated], {
		
		templateString: dojo.cache("dojox.architect", "resources/_Frontend.html"),
		widgetsInTemplate: true,
		
		startup:function(){
			this.inherited(arguments);
			
			
			dojo.query('.dojoxDndArea', this.toolBox.domNode).forEach(function(area){
				new dojox.architect.dnd.Area({target: area});
			},this);
			
		}
	});
});