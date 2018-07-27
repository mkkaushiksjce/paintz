'use strict';

/**
 * Create a new abstract DrawingTool instance.
 * @param {CanvasRenderingContext2D} cxt - The canvas context in which the image is shown
 * @param {CanvasRenderingContext2D} preCxt - The canvas context in which the shape preview is drawn
 */
function DrawingTool(cxt, preCxt) {
	Tool.apply(this, arguments);
}

DrawingTool.prototype = Object.create(Tool.prototype);


/**
 * Update the canvas's drawing context with the shape's properties.
 */
DrawingTool.prototype._prepareCanvas = function () {
	this._preCxt.lineWidth = this._lineWidth;
	this._preCxt.strokeStyle = this._lineColor;
	this._preCxt.fillStyle = this._fillColor;
};

/**
 * Handle the drawing tool becoming the active tool.
 * @override
 */
DrawingTool.prototype.activate = function () {
	this._preCxt.canvas.style.cursor = 'crosshair';
	toolbar.switchToolOptionsToolbox(toolbar.toolboxes.drawToolOptions);
};

/**
 * Handle the shape being started by a pointer.
 * @override
 * @param {Object} pointerState - The pointer coordinates and button
 */
DrawingTool.prototype.start = function (pointerState) {
	if (pointerState.button !== 2) {
		this._lineColor = settings.get('lineColor');
		this._fillColor = settings.get('fillColor');
	} else {
		this._lineColor = settings.get('fillColor');
		this._fillColor = settings.get('lineColor');
	}
	
	this._lineWidth = settings.get('lineWidth');
};

/**
 * Update the shape when the pointer is moved.
 * @override
 * @param {Object} pointerState - The pointer coordinates
 */
DrawingTool.prototype.move = function (pointerState) {
	this._prepareCanvas();
};

/**
 * Finish the shape when the pointer is released.
 * @override
 * @param {Object} pointerState - The pointer coordinates
 */
DrawingTool.prototype.end = function (pointerState) {
	this._cxt.drawImage(this._preCxt.canvas, 0, 0);
	Utils.clearCanvas(this._preCxt);
	undoStack.addState();
};
