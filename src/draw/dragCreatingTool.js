"use strict";
import go from 'gojs';

let maps = (function() {
    function DragCreatingTool() {
        go.Tool.call(this);
        this.name = "DragCreating";

        /** @type {Object} */
        this._archetypeNodeData = null;

        var b = new go.Part();
        b.layerName = "Tool";
        b.selectable = false;
        var r = new go.Shape();
        r.name = "SHAPE";
        r.figure = "Rectangle";
        r.fill = null;
        r.stroke = "magenta";
        r.position = new go.Point(0, 0);
        b.add(r);
        /** @type {Part} */
        this._box = b;

        /** @type {number} */
        this._delay = 175;
    }

    go.Diagram.inherit(DragCreatingTool, go.Tool);

    DragCreatingTool.prototype.canStart = function() {
        if (!this.isEnabled) return false;

        // gotta have some node data that can be copied
        if (this.archetypeNodeData === null) return false;

        var diagram = this.diagram;
        if (diagram === null) return false;
        // heed IsReadOnly & AllowInsert
        if (diagram.isReadOnly || diagram.isModelReadOnly) return false;
        if (!diagram.allowInsert) return false;

        var e = diagram.lastInput;
        // require left button & that it has moved far enough away from the mouse down point, so it isn't a click
        if (!e.left) return false;
        // don't include the following checks when this tool is running modally
        if (diagram.currentTool !== this) {
            if (!this.isBeyondDragSize()) return false;
            // must wait for "delay" milliseconds before that tool can run
            if (e.timestamp - diagram.firstInput.timestamp < this.delay) return false;
        }
        return true;
    };

    DragCreatingTool.prototype.doActivate = function() {
        var diagram = this.diagram;
        if (diagram === null) return;
        this.isActive = true;
        diagram.isMouseCaptured = true;
        diagram.add(this.box);
        this.doMouseMove();
    };

    DragCreatingTool.prototype.doDeactivate = function() {
        var diagram = this.diagram;
        if (diagram === null) return;
        diagram.remove(this.box);
        diagram.isMouseCaptured = false;
        this.isActive = false;
    };

    DragCreatingTool.prototype.doMouseMove = function() {
        var diagram = this.diagram;
        if (diagram === null) return;
        if (this.isActive && this.box !== null) {
            var r = this.computeBoxBounds();
            var shape = this.box.findObject("SHAPE");
            if (shape === null) shape = this.box.findMainElement();
            shape.desiredSize = r.size;
            this.box.position = r.position;
        }
    };

    DragCreatingTool.prototype.doMouseUp = function() {
        if (this.isActive) {
            var diagram = this.diagram;
            diagram.remove(this.box);
            try {
                diagram.currentCursor = "wait";
                this.insertPart(this.computeBoxBounds());
            } finally {
                diagram.currentCursor = "";
            }
        }
        this.stopTool();
    };

    DragCreatingTool.prototype.computeBoxBounds = function() {
        var diagram = this.diagram;
        if (diagram === null) return new go.Rect(0, 0, 0, 0);
        var start = diagram.firstInput.documentPoint;
        var latest = diagram.lastInput.documentPoint;
        return new go.Rect(start, latest);
    };

    DragCreatingTool.prototype.insertPart = function(bounds, background_picture) {
        if (background_picture.source == '') {
            return false;
        }

        var diagram = this.diagram;
        if (diagram === null) return null;
        var arch = this.archetypeNodeData;
        if (arch === null) return null;

        this.startTransaction(this.name);
        var part = null;
        if (arch !== null) {
            var data = diagram.model.copyNodeData(arch);
            if (data) {
                diagram.model.addNodeData(data);
                part = diagram.findPartForData(data);
            }
        }
        if (part !== null) {
            part.position = bounds.position;
            part.resizeObject.desiredSize = bounds.size;
            if (diagram.allowSelect) {
                diagram.select(part); // raises ChangingSelection/Finished
            }
        }

        // set the TransactionResult before raising event, in case it changes the result or cancels the tool
        this.transactionResult = this.name;
        this.stopTransaction();
        return part;
    };

    Object.defineProperty(DragCreatingTool.prototype, "box", {
        get: function() { return this._box; },
        set: function(val) { this._box = val; }
    });

    Object.defineProperty(DragCreatingTool.prototype, "delay", {
        get: function() { return this._delay; },
        set: function(val) { this._delay = val; }
    });

    Object.defineProperty(DragCreatingTool.prototype, "archetypeNodeData", {
        get: function() { return this._archetypeNodeData; },
        set: function(val) { this._archetypeNodeData = val; }
    });
    return [go, DragCreatingTool];
}());

let [gojs, DragCreatingTool] = maps;

export { gojs, DragCreatingTool };