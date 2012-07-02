define([
    "dojo/_base/declare",
    "dojox/dialog/DialogContainer",
    "dijit/layout/ContentPane"
    ], function(declare, DialogContainer){
	return declare("dojox.dialog.StandByDialog", DialogContainer, {
		// message : string
		// 		Contient le message affiché à l'utilisateur
		message : "Merci de patienter...",

		// messagePane : dijit.layout.ContentPane
		messagePane : null,

		// iconClass : string
		//		Classe css de l'icone à afficher devant le titre
		//		Ainsi que la vignette devant le message ?
		iconClass : null,

		// _connects : array
		//		Contient une liste des connects faits par ce widgets
		//		Cette liste sera utilisée lors de la suppression
		_connects : null,

		postCreate : function(){
			this.inherited(arguments);

			this._connects = [];

			this.messagePane = new dijit.layout.ContentPane({
				content : this.message
			}, dojo.create("div", {}, this.containerNode));
			this.addChild(this.messagePane);
			this.messagePane.startup();

			if(null != this.iconClass && "" != this.iconClass){
				dojo.addClass(messagePane.containerNode, this.iconClass);
			}
		},

		onBeforeHide : function(){
			this._connects.forEach(function(aConnect){
				this.disconnect(aConnect);
			}, this);
			var onHidden = this.connect(this, 'onHide', dojo.hitch(this, function(){
				this.disconnect(onHidden);
				setTimeout(dojo.hitch(this,function(){ this.destroyRecursive(); }),	0);
			}));
			return true;
		},

		setMessage: function(newMessage){
			this.messagePane.set("content", newMessage);
		}
	});
});