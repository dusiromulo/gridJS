function Match3(size_x, size_y, cell_size){
	this.size_x = size_x;
	this.size_y = size_y;
	this.cell_size = cell_size;
	this.matrix_pieces = createMatrixOfPieces(size_x, size_y);
	this.colors = ['#A413CE', '#0879A0', '#63FF03'];
	this.images = ['images/ball.png', 'images/heart.png', 'images/star.png'];		

	this.user_drag_piece = null;
	this.secondary_drag_piece = null;

	this.user_drag_piece_position_x = null;
	this.user_drag_piece_position_y = null;
	this.secondary_drag_piece_position_x = null;
	this.secondary_drag_piece_position_y = null;

	this.has_changed = false;

	this.grid_element = $(".grid");
	this.fill = function(){
		for (var line = 0; line < this.size_y; line++){
			for (var column = 0; column < this.size_x; column++){
				var index = getRandomIndex();
				this.matrix_pieces[line][column] = new Piece(column, line, this.colors[index], this.images[index], this);
				this.matrix_pieces[line][column].element = this.matrix_pieces[line][column].createUi();
				this.matrix_pieces[line][column].setupImage();

				var gridCell = new GridCell(column, line, '#000000', '#FFFFFF', this);
				gridCell.element = gridCell.createUi();

				this.grid_element.append(gridCell.element);
				this.grid_element.append(this.matrix_pieces[line][column].element);

				gridCell.setupCss();
				this.matrix_pieces[line][column].setupCss();
			}
		}
	};

	this.verifyWin = function(){
		
	};

	this.drop = function(){
		if (this.has_changed){
			this.user_drag_piece.position_x = this.secondary_drag_piece_position_x;
			this.user_drag_piece.position_y = this.secondary_drag_piece_position_y;

			this.matrix_pieces[this.user_drag_piece_position_y][this.user_drag_piece_position_x] = this.secondary_drag_piece;
			this.matrix_pieces[this.secondary_drag_piece_position_y][this.secondary_drag_piece_position_x] = this.user_drag_piece;

			// Set full color
			$(this.user_drag_piece.element).css('opacity', 1);
			$(this.secondary_drag_piece.element).css('opacity', 1);

			// Set new limit
			this.user_drag_piece.setUpNewLimit();
			this.secondary_drag_piece.setUpNewLimit();
			
			this.user_drag_piece = null;
			this.secondary_drag_piece = null;
			this.has_changed = false;

			this.verifyWin();
		}
	}

	this.clickPiece = function(self, event, ui){
		self.x_current_piece_moving = event.originalEvent.pageX;
		self.y_current_piece_moving = event.originalEvent.pageY;
		
		this.user_drag_piece = self;
		
		this.user_drag_piece_position_x = (ui.originalPosition.left - this.grid_element.position().left) / this.cell_size;
		this.user_drag_piece_position_y = (ui.originalPosition.top - this.grid_element.position().top) / this.cell_size;
	}

	this.dragPiece = function(pieceInstance, ui, event, thisDraggable){
		var drag_type = pieceInstance.doSwapIfNecessary(pieceInstance, ui);

    	if (drag_type == thisDraggable.SAME_PLACE_ORIGIN){
    		if (pieceInstance.x_current_piece_moving) {
	            axis = Math.abs(event.originalEvent.pageX - pieceInstance.x_current_piece_moving) > Math.abs(event.originalEvent.pageY - pieceInstance.y_current_piece_moving) ? 'x' : 'y';
	            $(thisDraggable).draggable('option', 'axis', axis);
	            pieceInstance.x_current_piece_moving = pieceInstance.y_current_piece_moving = null;
        	}
        	else{
        		pieceInstance.x_current_piece_moving = event.originalEvent.pageX;
				pieceInstance.y_current_piece_moving = event.originalEvent.pageY;
        	}
    	}
	}

	this.dropPiece = function(pieceInstance, thisDraggable){
		pieceInstance.x_current_piece_moving = pieceInstance.y_current_piece_moving = null;
        $(thisDraggable).draggable('option', 'axis', false);
	}

	this.verifyHasCombination = function(y_max, x_max){
		var hasCombinationInMatrix = false;
		for (var line = 0; line < y_max; line++){
			for (var column = 0; column < x_max; column++){
				if (line == 0 || line == y_max){
					if (column == 0 || column == x_max){
						// primeira ou ultima linha, e primeira ou ultima coluna
					}
					else{

					}
				}
				else{
					if (column == 0 || column == x_max){
						
					}
					else{

					}
				}
			}
		}
	}
}

function createMatrixOfPieces(size_x, size_y){
	var matrix_pieces = new Array(size_y);
	for (var line = 0; line < size_y; line++){
		matrix_pieces[line] = new Array(size_x);
	}
	return matrix_pieces;
}

function getRandomIndex() {
    return Math.floor(Math.random() * 3);
}