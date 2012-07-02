define([
	"dojo/_base/declare",
	"dojox/dialog/DialogContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Button"
	], 
	function(declare, dialogContainer){
		return declare(
			"dojox.dialog.ConfirmDialog", dialogContainer, {
				// message : string
				// 		Contient le message affiché à l'utilisateur
				message : "Vous avez modifié vos données"
				+ "\n" + "Souhaitez-vous les enregistrer ?",

				// position : string
				//		Définit la position flotante des boutons
				//			right : aligne les boutons sur la droite  - DEFAULT
				//			left : aligne les boutons sur la gauche
				//			center : centre les boutons
				position : "right",

				// refocus: Boolean
				// 		A Toggle to modify the default focus behavior of a Dialog, which
				// 		is to re-focus the element which had focus before being opened.
				//		False will disable refocusing. Default: true
				//		We don't want the dialog to change the focus
				refocus: false,

				// autofocus: Boolean
				// 		A Toggle to modify the default focus behavior of a Dialog, which
				// 		is to focus on the first dialog element after opening the dialog.
				//		False will disable autofocusing. Default: true
				//		We don't want the dialog to change the focus
				autofocus: false,

				// buttons : array
				//		contient des objets tels que :
				//		{
				//			label : 'Non',
				//			value : false,
				//			hasFocus : true		<-- only set to true if has focus
				//		}
				//		L'ordre des objets sera respecté.
				//		Attention, l'ordre doit tenir compte de this.position !
				buttons : [{
					label	: "Oui",
					value	: true,
					hasFocus: true,
					id		: null
				}, {
					label	: "Non",
					value	: false,
					id		: null
				}],

				// defaultReturnValue : boolean
				//		Valeur retournée lorsque l'utilisateur clique sur la croix
				//		ou lorsqu'il presse la touche ESC
				//		cette valeur DOIT être settée
				defaultReturnValue : null,

				// iconClass : string
				//		Classe css de l'icone à afficher devant le titre
				//		Ainsi que la vignette devant le message ?
				iconClass : null,

				// _hasReturned : boolean
				//		Permet de savoir si l'utilisateur a cliqué sur un bouton ou pas
				_hasReturned : false,

				// _hasReturned : boolean
				_returnedValue : false,

				// _firstFocus : object
				//		Contains a pointer to the instance of button that will receive focus
				_firstFocus : null,

				postCreate : function(){
					this.inherited(arguments);

					if(null == this.defaultReturnValue){
						console.error(
							"la propriété defaultReturnValue n'a pas été settée, "
							+ "par défaut la valeur false sera retournée"
							);
						this.defaultReturnValue = false;
					}

					this._createMessageContainer();

					if(null != this.iconClass && "" != this.iconClass){
						// we prepend an icon to the title
						dojo.addClass(this.titleNode, this.iconClass + "_16");
						dojo.addClass(messagePane.containerNode, this.iconClass);
					}
					var buttonPane = new dijit.layout.ContentPane({
						style: "text-align:" + this.position + ";"
					}, dojo.create("div"));
					buttonPane.startup();
					this.addChild(buttonPane);

					dojo.forEach(this.buttons, function(bouton){
						if(null == bouton.id){
							bouton.id = bouton.label;
						}
						var button = new dijit.form.Button(bouton, dojo.create("div"));
						dojo.addClass(button.domNode, "dialogContainer");
						dojo.place(button.domNode, buttonPane.containerNode, "last");
						this.connect(button, "onClick", function(){
							this.onButtonClick(button.get("value"));
							this.hide();
						}, this);

						// by default we give focus to the first button
						// then when we meet a focus : true in a button property
						// we update
						if(null == this._firstFocus
							|| (!!button.hasOwnProperty("hasFocus") && !!button.hasFocus)){
							this._firstFocus = button;
							this._firstFocus.focus();
						}
					}, this);
				},

				_createMessageContainer: function(){
					var messagePane = new dijit.layout.ContentPane({
						content : this.message
						}, dojo.create("div"));
					this.addChild(messagePane);
				},

				onButtonClick : function(value){
					// summary :
					//		Used for connects, but also return the value
					//		Returns the value of the clicked button
					this._hasReturned = true;
					this._returnedValue = value;
					return value;
				},

				onBeforeHide : function(){
					if(!this._hasReturned){
						this.onButtonClick(this.defaultReturnValue);
					}
					var onHidden = null;
					onHidden = this.connect(this, 'onHide',dojo.hitch(this, function(){
						this.disconnect(onHidden);
						setTimeout(dojo.hitch(this, function(){
							this.destroyRecursive();
						}), 0);
					}));
					return true;
				}

			}
			);
	});