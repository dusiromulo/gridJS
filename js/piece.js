function Piece(position_x, position_y, color, image, parent){
	this.position_x = position_x;
	this.position_y = position_y;
	this.color = color;
	this.image = image;
	this.parent = parent;
	this.element = null;
	this.limits = null;
	this.x_current_piece_moving = null;
	this.y_current_piece_moving = null;
	this.SAME_PLACE_ORIGIN = -1;
	this.DIFF_PLACE_ORIGIN = -2;

	// methods
	this.createUi = function(){
		var element = document.createElement("div");
		this.setupDraggableProperties(this, element);
		this.limits = this.generateLimits(this.position_x, this.position_y);
		return element;
	}

	this.setupImage = function(){
		if (this.image){
			$(this.element).append("<img src='" + this.image + "' style='display:block;margin-left:auto;margin-right:auto;margin-top:8px;'>");
		}
	}

	this.setupCss = function(){
		$(this.element).css("width", (this.parent.cell_size * 0.92) + "px");
		$(this.element).css("height", (this.parent.cell_size * 0.92) + "px");
		$(this.element).css("margin", (this.parent.cell_size * 0.04) + "px");
		$(this.element).css("top", this.parent.grid_element.position().top + this.position_y * this.parent.cell_size + "px");
		$(this.element).css("left", this.parent.grid_element.position().left + this.position_x * this.parent.cell_size + "px");
		$(this.element).css("position", "fixed");
		$(this.element).css("background-color", this.color);
		$(this.element).css("border-radius", "8px");
		$(this.element).css("z-index", 2);
		$(this.element).hover(function() {
			$(this).css("cursor","move");
		});
	}

	this.move = function(position_x, position_y){
		this.position_x = position_x;
		this.position_y = position_y;

		$(this.element).css("top", this.parent.grid_element.position().top + this.position_y * this.parent.cell_size + "px");
		$(this.element).css("left", this.parent.grid_element.position().left + this.position_x * this.parent.cell_size + "px");
	}

	this.setupDraggableProperties = function(self, element){
		$(element).draggable({
			cursor: "move",
			opacity: 0.5,
			containment: this.generateLimits(this.position_x, this.position_y),
			grid: [this.parent.cell_size, this.parent.cell_size],
			start: function( event, ui ) {
				self.x_current_piece_moving = event.originalEvent.pageX;
				self.y_current_piece_moving = event.originalEvent.pageY;
				
				self.parent.user_drag_piece = self;
				
				self.parent.user_drag_piece_position_x = (ui.originalPosition.left - self.parent.grid_element.position().left) / self.parent.cell_size;
				self.parent.user_drag_piece_position_y = (ui.originalPosition.top - self.parent.grid_element.position().top) / self.parent.cell_size;
			}, 
		    drag: function (event, ui) { 
		    	var drag_type = self.doSwapIfNecessary(self, ui);

		    	if (drag_type == this.SAME_PLACE_ORIGIN){
		    		if (self.x_current_piece_moving) {
			            axis = Math.abs(event.originalEvent.pageX - self.x_current_piece_moving) > Math.abs(event.originalEvent.pageY - self.y_current_piece_moving) ? 'x' : 'y';
			            $(this).draggable('option', 'axis', axis);
			            self.x_current_piece_moving = self.y_current_piece_moving = null;
		        	}
		        	else{
		        		self.x_current_piece_moving = event.originalEvent.pageX;
						self.y_current_piece_moving = event.originalEvent.pageY;
		        	}
		    	}
		    },
		    stop: function() {
		        self.x_current_piece_moving = self.y_current_piece_moving = null;
		        $(this).draggable('option', 'axis', false);
		    }
		});
	}

	this.generateLimits = function(x, y){
		var limits = new Array(4);
		if (x == 0){
			limits[0] = 0 + this.parent.grid_element.position().left;
		}
		else{
			limits[0] = ((x - 1) * this.parent.cell_size) + this.parent.grid_element.position().left;
		}
		if (y == 0){
			limits[1] = 0  + this.parent.grid_element.position().top;
		}
		else{
			limits[1] = ((y - 1) * this.parent.cell_size) + this.parent.grid_element.position().top;
		}
		if (x == this.parent.size_x - 1){
			limits[2] = (x * this.parent.cell_size) + this.parent.grid_element.position().left;
		}
		else{
			limits[2] = ((x + 1) * this.parent.cell_size) + this.parent.grid_element.position().left;
		}
		if (y == this.parent.size_y - 1){
			limits[3] = (y * this.parent.cell_size) + this.parent.grid_element.position().top;
		}
		else{
			limits[3] = ((y + 1) * this.parent.cell_size) + this.parent.grid_element.position().top;
		}

		return limits;
	}

	this.setUpNewLimit = function(){
		this.limits = this.generateLimits(this.position_x, this.position_y);
		$(this.element).draggable('option', 'containment', this.limits);
	}

	this.doSwapIfNecessary = function(self, ui){
		if (self.position_x == ((ui.position.left - self.parent.grid_element.position().left) / self.parent.cell_size) && 
			self.position_y == ((ui.position.top - self.parent.grid_element.position().top) / self.parent.cell_size)){
	    	if (self.parent.secondary_drag_piece){
				
				$(self.parent.secondary_drag_piece.element).css('opacity', 1.0);
				
				self.parent.secondary_drag_piece.move(self.parent.secondary_drag_piece_position_x, self.parent.secondary_drag_piece_position_y);
	    		
	    		self.parent.secondary_drag_piece = null;
	    		self.parent.secondary_drag_piece_position_x = null;
				self.parent.secondary_drag_piece_position_y = null;

	    		self.parent.has_changed = false;
	    		return this.SAME_PLACE_ORIGIN;
	    	}
		}
		else{
			var y = (ui.position.top - self.parent.grid_element.position().top) / self.parent.cell_size;
			var x = (ui.position.left - self.parent.grid_element.position().left) / self.parent.cell_size;

			self.parent.secondary_drag_piece = self.parent.matrix_pieces[y][x];
	    	
	    	$(self.parent.secondary_drag_piece.element).css('opacity', 0.5);
	    	
	    	self.parent.secondary_drag_piece.move(self.parent.user_drag_piece_position_x, self.parent.user_drag_piece_position_y);
	    	
	    	self.parent.secondary_drag_piece_position_x = (ui.position.left - self.parent.grid_element.position().left) / self.parent.cell_size;
			self.parent.secondary_drag_piece_position_y = (ui.position.top - self.parent.grid_element.position().top) / self.parent.cell_size;
			self.parent.has_changed = true;	
			return this.DIFF_PLACE_ORIGIN;
		}
	}
}

