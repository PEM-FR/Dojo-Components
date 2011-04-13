define("dojox/architect/dnd/Area", ["dojo"], function(dojo) {

	return dojo.declare("dojox.architect.dnd.Area", null, {
		
		targetNode: null,
		_connects: [],
		_dndActive: false,
		handleClass: "",
		_lastDndNode: null,
		_lastState: null,
		
		constructor:function(args){
			this._connects = [];
			this.targetNode = args.target;
			this.handleClass = args.handleClass || "dndHandle";
			
			this._connects.push(dojo.connect(window.document, "onmouseup", this, "_onTargetMouseUp"));
			this._connects.push(dojo.connect(this.targetNode, "onmousedown", this, "_onTargetMouseDown"));
			this._connects.push(dojo.connect(window.document, "onmousemove", this, "_onDocumentMouseMove"));
			/*
			this._connects.push(dojo.connect(window.document, "onselectstart", function(evt){
				dojo.stopEvent(evt);
			}));
			*/
		},
		_onTargetMouseUp:function(evt){
			this._dndActive = false;
			//console.log(this._lastState);
			if(this._lastState != null){
				dojo.style(this._lastDndNode, this._lastState.style);
				dojo.place(this._lastDndNode, this._lastState.parent, this._lastState.index);
			}
		},
		_onTargetMouseDown:function(evt){
			this._dndActive = true;
			//console.log(evt.originalTarget);
			
			if(dojo.hasClass(evt.originalTarget, this.handleClass)){
				//console.log(evt.originalTarget);
				this._lastDndNode = evt.originalTarget;
				this._lastState = {
					parent: this._lastDndNode.parentNode,
					style: {
						"position": dojo.style(this._lastDndNode, "position"),
						"left": dojo.style(this._lastDndNode, "left") + "px",
						"top": dojo.style(this._lastDndNode, "top") + "px",
						"zIndex": dojo.style(this._lastDndNode, "zIndex")					
					},
					index: dojo.indexOf(this._lastDndNode.parentNode.children, evt.originalTarget)
				};

			}
		},
		_onDocumentMouseMove:function(evt){
			if(this._dndActive === true){
				dojo.place(this._lastDndNode, dojo.body());
				dojo.style(this._lastDndNode, {
					"position": "absolute",
					"left": evt.clientX + "px",
					"top": evt.clientY + "px",
					"zIndex": 1000
				});
			}
		},
		destroy:function(){
			dojo.forEach(this._connects, dojo.disconnect);
		}
	});
});