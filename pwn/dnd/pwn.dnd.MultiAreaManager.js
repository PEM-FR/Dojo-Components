// Author : PEM-FR (on github), PEM on #dojo on freenode, PEM_FR on dojofoundation

dojo.provide("pwn.dnd.MultiAreaManager");

dojo.require("dojox.mdnd.AreaManager");
dojo.require("dojox.mdnd.DropIndicator");
//Attention : for instance this code only work for OverDropMode :)
dojo.require("dojox.mdnd.dropMode.OverDropMode");

dojo.declare(
	"pwn.dnd.MultiAreaManager",
	null,
	{
		// summary:
		//		This class is used to wrap a multi-area support layer around
		//		dojox.mdnd.areaManager so that imbricated areas will work
		//		as expected. This is a hack, until a cleaner class
                //              of the standard areaManager & Co is released.
		getManager : function (){
			// summary :
			//		Add multi area support layer

			areaManager = dojox.mdnd.areaManager();

			areaManager.getAreaByNodeId = function(idNode){
				// summary:
				//		To get Dnd Area from a nodeId
				// idNode: string
				//		The id of a DOM node corresponding to a Dnd Area
				var areaFound = false;
				this._areaList.some(
					function(area){
						if(area.node.id == idNode){
							areaFound = area;
							return true;
						}
						return false;
					},
					this
				);
				return areaFound;
			};
			areaManager.getAreaByNode = function(/*DOMNode*/node){
				return this.getAreaByNodeId(node.id);
			};
			areaManager.onDrop = function(/*DOMNode*/node){
				// summary:
				//		Drop the dragged item where the dropIndicator is displayed.
				// node:
				//		The node which is about to be dropped
				// tags:
				//		callback

				//console.log("dojox.mdnd.AreaManager ::: onDrop");
				//dropCancel
				this.onDropCancel();
				var targetArea = this._areaList[this._currentIndexArea];
				dojo.removeClass(node, "dragNode");
				var style = node.style;
				style.position = "relative";
				style.left = "0";
				style.top = "0";
				style.width = "auto";
				if(targetArea.node == this._dropIndicator.node.parentNode){
					targetArea.node.insertBefore(node, this._dropIndicator.node);
				}
				else{
					// case if the dropIndicator is in the area which has been unregistered during the drag.
					targetArea.node.appendChild(node);
					this._currentDropIndex = targetArea.items.length;
				}
				// add child into the new target area.
				var indexChild = this._currentDropIndex;
				if(indexChild == -1){
					indexChild = targetArea.items.length;
				}
				var children = targetArea.items;
				var firstListArea = children.slice(0, indexChild);
				var lastListArea = children.slice(indexChild, children.length);
				firstListArea[firstListArea.length] = this._dragItem;
				targetArea.items = firstListArea.concat(lastListArea);

				this._setMarginArea(targetArea, node);
				dojo.forEach(this._areaList, function(obj){
					obj.initItems = false;
				});
				// disconnect onDrop handler
				dojo.disconnect(this._dragItem.handlers.pop());
				dojo.disconnect(this._dragItem.handlers.pop());
				this._resetAfterDrop();
				// remove the cover
				if(this._cover){
					dojo.body().removeChild(this._cover);
					dojo.body().removeChild(this._cover2);
				}
				dojo.publish("/dojox/mdnd/drop",[node, targetArea, indexChild]);
				this.onDropped(node);
			};
			areaManager.onDropped = function(node){
				// to be able to connect once an item has been dropped
				console.log('in onDropped');
			};
			areaManager.lastZIndex = null;
			areaManager.getNextHighestRegIndex = function(){
				if(null == this.lastZIndex){
					this.lastZIndex = 1;
					return this.lastZIndex;
				}
				return ++this.lastZIndex;
			};
			areaManager.registerByNode = function(/*DOMNode*/area, /*Boolean*/notInitAreas){
				// summary:
				//		To register Dnd Area : insert the DndArea using the specific sort of dropMode.
				// area:
				//		a DOM node corresponding to the Dnd Area
				// notInitAreas:
				//		if false or undefined, init the areas.

				//console.log("dojox.mdnd.AreaManager ::: registerByNode", area);
				var index = this._getIndexArea(area);
				if(area && index == -1){
					var acceptType = area.getAttribute("accept");
					var accept = (acceptType) ? acceptType.split(/\s*,\s*/) : ["text"];
					var obj = {
						'node': area,
						'items': [],
						'coords': {},
						'margin': null,
						'accept': accept,
						'initItems': false,
						'regIndex' : this.getNextHighestRegIndex()
					};
					console.log('area item : ', this._getChildren(area));
					console.log('area : ', area);
					dojo.forEach(this._getChildren(area), function(item){
						console.log('area item : ', item);
						this._setMarginArea(obj, item);
						obj.items.push(this._addMoveableItem(item));
					}, this);
					this._areaList = this._dropMode.addArea(this._areaList, obj);
					if(!notInitAreas){
						this._dropMode.updateAreas(this._areaList);
					}
					dojo.publish("/dojox/mdnd/manager/register",[area]);
				}
			};

			// If the manager has a set dropMode
                        // TODO: manage all kinds of DropMode
			if(null != areaManager._dropMode){
				areaManager._dropMode.getTargetArea = function(
					/*Array*/areaList,
					/*Object*/ coords,
					/*integer*/currentIndexArea
				){
					// summary:
					//		get the nearest D&D area.
					// areaList:
					// 		a list of D&D areas objects
					// coords:
					//		coordinates [x,y] of the dragItem (see getDragPoint())
					// currentIndexArea:
					//		an index representing the active D&D area
					//returns:
					//		the index of the D&D area

					//console.log("pwn.dnd.dropMode.OverDropMode ::: getTargetArea");
					var index = -1;
					var x = coords.x;
					var y = coords.y;
					var end = areaList.length;
					var start = 0, direction = "right", compute = false;
					var regIndex = 0;
						if(direction === "right"){
							for(var i = start; i < end; i++){
								if(this._checkInterval(areaList, i, x, y)){
									var newRegIndex = areaList[i].regIndex;
									if(newRegIndex > regIndex){
										regIndex = newRegIndex;
										index = i;
									}
								}
							}
						}
						else{
							for(var i = start; i >= end; i--){
								if(this._checkInterval(areaList, i, x, y)){
									var newRegIndex = areaList[i].regIndex;
									if(newRegIndex > regIndex){
										regIndex = newRegIndex;
										index = i;
									}
								}
							}
						}
//					}
					this._oldXPoint = x;
					return index; // Integer
				};
			}

			return areaManager;
		}

	}
);

pwn.dnd._areaManager = null;
// Just call this function instead of dojox.mdnd.areaManager(); to get the multiArea support
pwn.dnd.multiAreaManager = function(){
	// summary:
	//		Returns the current areaManager, creates one if it is not created yet.
	if(!pwn.dnd._areaManager){
		var wrapper = new pwn.dnd.MultiAreaManager();
		pwn.dnd._areaManager = wrapper.getManager();
	}
	return pwn.dnd._areaManager;	// Object
};
