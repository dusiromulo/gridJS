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
				if (self.parent.has_changed){

					self.parent.user_drag_piece.position_x = self.parent.secondary_drag_piece_position_x;
					self.parent.user_drag_piece.position_y = self.parent.secondary_drag_piece_position_y;

					self.parent.matrix_pieces[self.parent.user_drag_piece_position_y][self.parent.user_drag_piece_position_x] = self.parent.secondary_drag_piece;
					self.parent.matrix_pieces[self.parent.secondary_drag_piece_position_y][self.parent.secondary_drag_piece_position_x] = self.parent.user_drag_piece;

					// Set full color
					$(self.parent.user_drag_piece.element).css('opacity', 1);
					$(self.parent.secondary_drag_piece.element).css('opacity', 1);

					// Set new limit
					self.parent.user_drag_piece.setUpNewLimit();
					self.parent.secondary_drag_piece.setUpNewLimit();
					
					self.parent.user_drag_piece = null;
					self.parent.secondary_drag_piece = null;
					self.parent.has_changed = false;

					self.parent.verifyWin();
				}
			}
	    });
	}
}