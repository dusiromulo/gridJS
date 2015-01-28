function GridCell(position_x, position_y, color, border_color, parent){
	this.position_x = position_x;
	this.position_y = position_y;
	this.color = color;
	this.border_color = border_color;
	this.parent = parent;
	this.element = null;

	// methods
	this.createUi = function(){
		var element = document.createElement("div");
		this.setupDroppableProperties(this, element);
		return element;
	}

	this.setupCss = function(){
		$(this.element).css("width", this.parent.cell_size + "px");
		$(this.element).css("height", this.parent.cell_size + "px");
		$(this.element).css("top", this.parent.grid_element.position().top + this.position_y * this.parent.cell_size + "px");
		$(this.element).css("left", this.parent.grid_element.position().left + this.position_x * this.parent.cell_size + "px");
		$(this.element).css("position", "fixed");
		$(this.element).css("background-color", this.color);
		$(this.element).css("border-style", "solid");
		$(this.element).css("border-color", this.border_color);
		$(this.element).css("border-width", "1px");
		$(this.element).css("z-index", 1);
	}

	this.setupDroppableProperties = function(self, element){
		$( element ).droppable({
			drop: function( event, ui ) {
				self.parent.drop();
			}
	    });
	}
}