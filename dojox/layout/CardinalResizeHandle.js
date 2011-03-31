dojo.provide("dojox.layout.CardinalResizeHandle");

dojo.declare("dojox.layout.CardinalResizeHandle", dijit._Widget, {
    // summary:
    //        A class to create a resizehandle based on the cardinal system
	//		  example http://jsfiddle.net/fCD7W/8/
    // targetId:
    //        id of the Widget OR DomNode that I will size
    targetId: "",
    _handleNodes: [],
    _pconnects: [],

    constructor: function() {
        this._pconnects = [];
        this._handleNodes = [];
    },
    postCreate: function() {
        // summary:
        //            Called after a widget's dom has been setup
        // tags:
        //            protected
        this.inherited(arguments);

        // acceppt targetNode or targetId
        if (dojo.isString(this.targetId)) {
            var widget = dijit.byId(this.targetId);
            var node = dojo.byId(this.targetId);
            if (widget) {
                this.targetNode = widget.domNode;
            } else {
                this.targetNode = node;
            }
        } else {
            if (this.targetId instanceof(dijit._Widget)) {
                this.targetNode = this.targetId.domNode;
            } else {
                this.targetNode = this.targetId;
            }
        }
        // connect to global mouse events
        this._pconnects.push(dojo.connect(dojo.doc, "onmouseup", this, "_onMouseUp"));
        this._pconnects.push(dojo.connect(dojo.doc, "onmousemove", this, "_onMouseMove"));

        this._createResizeHandles();
    },
    // resizeAxis:
    //        one of: x|y|xy limit resizing to a single axis, default to xy ...
    resizeAxis: "xy",
    // basezIndex:
    //        z-index to control the z-index of the resize-squares
    basezIndex: 0,
    // minHeight: Integer
    //    smallest height in px resized node can be
    minHeight: 25,

    // minWidth: Integer
    //    smallest width in px resize node can be
    minWidth: 25,
    _mouseDown: false,
    _lastDirection: "",
    _lastMarginBox: {
        l: 0,
        t: 0,
        w: 0,
        h: 0
    },
    _lastPosition: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    },
    _lastGrab: {
        x: 0,
        y: 0
    },
    onResizeComplete: function(/*Object?*/marginBox) {
        // summary:
        //        connect or override this method to know when the resize is complete
        // marginBox:
        //        the dojo.marginBox of the resized node
        },
    onResize: function( /*DomNode?*/node, /*Object?*/marginBox) {
        // summary:
        //        connect or override this method to know when the node is resizing
        // node:
        //        the resize domNode
        // marginBox:
        //        the dojo.marginBox of the resized node
        },
    _onMouseDown: function(e) {
        // summary:
        //        Initials the resize
        // tags:
        //        protected
        this._lastMarginBox = dojo.marginBox(this.targetNode);
        this._lastPosition = dojo.position(this.targetNode);
        this._lastGrab = {
            x: e.clientX,
            y: e.clientY
        };

        this._mouseDown = true;
        var handle = e.target;
        var direction = dojo.attr(handle, "className");
        //N,S,W,E,NW,NE,SW,SE
        this._lastDirection = direction.substr(direction.length - 2, 3).replace("_", "");

        dojo.stopEvent(e);
    },
    _onMouseUp: function(e) {
        // summary:
        //        Stops the resize onMouseUp
        // tags:
        //        protected
        if (this._mouseDown == true) {
            this.onResizeComplete(dojo.marginBox(this.targetNode));
        }
        this._mouseDown = false;
        dojo.stopEvent(e);
    },
    _onMouseMove: function(e) {
        // summary:
        //        Calculates the new size while a resize is in progress
        // tags:
        //        protected
        if (this._mouseDown === true) {
            var newBox = {};

            if (this._lastDirection.indexOf("E") != -1) {
                newBox.w = Math.max(this.minWidth, this._lastMarginBox.w + e.clientX - this._lastGrab.x);
            }
            if (this._lastDirection.indexOf("S") != -1) {
                newBox.h = Math.max(this.minHeight, this._lastMarginBox.h + e.clientY - this._lastGrab.y);
            }
            if (this._lastDirection.indexOf("W") != -1) {
                newBox.l = Math.min(this._lastMarginBox.l + e.clientX - this._lastGrab.x, this._lastMarginBox.l + this._lastMarginBox.w - this.minWidth);
                newBox.w = Math.max(this.minWidth, this._lastMarginBox.w - e.clientX + this._lastGrab.x);
            }
            if (this._lastDirection.indexOf("N") != -1) {
                newBox.t = Math.min(this._lastMarginBox.t + e.clientY - this._lastGrab.y, this._lastMarginBox.t + this._lastMarginBox.h - this.minHeight);
                newBox.h = Math.max(this.minHeight, this._lastMarginBox.h - e.clientY + this._lastGrab.y);
            }

            //apply the new size
            dojo.marginBox(this.targetNode, newBox);
            this.onResize(this.targetNode, newBox);

            this._createResizeHandles();

            dojo.stopEvent(e);
        }
    },
    _createResizeHandles: function() {
        // summary:
        //        Creates new or updates existing squares based on the
        //        cardinal system to provide the resize handles
        // tags:
        //        protected
        var squareBorderSize = 1;
        var squareSize = 6;
        //px
        var squareSizeHalf = 4;
        var squareSizePx = squareSize + "px";
        var squareSizeHalfPx = squareSizeHalf + "px";
        var squareSizeHalfNegPx = "-" + squareSizeHalf + "px";

        // descriptor for the resizehandles
        var positions = [{
            "direction": "NW",
            "axis": "xy",
            "style": {
                "top": squareSizeHalfNegPx,
                "left": squareSizeHalfNegPx
            }
        },
        {
            "direction": "NE",
            "axis": "xy",
            "style": {
                "top": squareSizeHalfNegPx,
                "right": squareSizeHalfNegPx
            }
        },
        {
            "direction": "SE",
            "axis": "xy",
            "style": {
                "bottom": squareSizeHalfNegPx,
                "right": squareSizeHalfNegPx
            }
        },
        {
            "direction": "SW",
            "axis": "xy",
            "style": {
                "bottom": squareSizeHalfNegPx,
                "left": squareSizeHalfNegPx
            }
        },
        {
            "direction": "N",
            "axis": "y",
            "style": {
                "top": squareSizeHalfNegPx,
                "left": ((dojo.marginBox(this.targetNode).w / 2) - squareSizeHalf) + "px"
            }
        },
        {
            "direction": "S",
            "axis": "y",
            "style": {
                "bottom": squareSizeHalfNegPx,
                "left": ((dojo.marginBox(this.targetNode).w / 2) - squareSizeHalf) + "px"
            }
        },
        {
            "direction": "W",
            "axis": "x",
            "style": {
                "left": squareSizeHalfNegPx,
                "top": ((dojo.marginBox(this.targetNode).h / 2) - squareSizeHalf) + "px"
            }
        },
        {
            "direction": "E",
            "axis": "x",
            "style": {
                "right": squareSizeHalfNegPx,
                "top": ((dojo.marginBox(this.targetNode).h / 2) - squareSizeHalf) + "px"
            }
        }];
        // create the resize handles based on the position descriptor
        dojo.forEach(positions,
        function(item) {
            if (this.resizeAxis.indexOf(item.axis) == -1) {
                return;
            }

            var node;

            if (! (node = dojo.query("." + "dojoxLayoutCardinalResizeSquare_" + item.direction, this.targetNode)[0])) {
                node = dojo.create("div", {
                    "style": {
                        "position": "absolute",
                        "height": squareSizePx,
                        "width": squareSizePx,
                        "backgroundColor": "white",
                        "border": squareBorderSize + "px solid black",
                        "zIndex": this.basezIndex + 1
                    }
                });

                dojo.addClass(node, "dojoxLayoutCardinalResizeSquare_" + item.direction);
                dojo.style(node, "cursor", item.direction + "-resize");
                dojo.place(node, this.targetNode);
                this.connect(node, "onmousedown", dojo.hitch(this, "_onMouseDown"));
                this._handleNodes.push(node);
            }
            //apply the new position to the square
            dojo.style(node, item.style);
        },
        this);
    },
    destroy: function() {
        this.inherited("destroy", arguments);
        //disconnect listeners
        dojo.forEach(this._pconnects, dojo.disconnect);
        //destroy handleNodes
        dojo.forEach(this._handleNodes,
        function(node) {
            dojo.destroy(node);
        },
        this);
    }
});