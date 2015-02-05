function Match3(size_x, size_y, cell_size, quantity_of_types){
	this.size_x = size_x;
	this.size_y = size_y;
	this.cell_size = cell_size;
	this.quantity_of_types = quantity_of_types;
	this.matrix_pieces = createMatrixOfPieces(size_x, size_y);
	this.types = arrayOfTypes(quantity_of_types);		
	this.colors = ['#00FFCC', '#33FFA3', '#66FF7A', '#99FF52', '#CCFF29', '#FFFF00'];
	this.images = ['images/ball.png', 'images/heart.png', 'images/star.png'];

	this.click_drag_piece = null;
	this.secondary_drag_piece = null;

	this.click_drag_piece_position_x = null;
	this.click_drag_piece_position_y = null;
	this.secondary_drag_piece_position_x = null;
	this.secondary_drag_piece_position_y = null;

	this.has_changed = false;

	this.grid_element = $(".grid");
	this.fill = function(){
		for (var line = 0; line < this.size_y; line++){
			for (var column = 0; column < this.size_x; column++){
				var index = getRandomIndex(quantity_of_types);
				this.matrix_pieces[line][column] = new Piece(column, line, this.types[index],this.colors[index], null/*this.images[index]*/, this);
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

	// Function implements droppable.drop() in jquery ui
	this.drop = function(){
		
		$(this.click_drag_piece.element).css('opacity', 1);
		
		if (this.has_changed){

			this.click_drag_piece.movePositions(this.secondary_drag_piece_position_x, this.secondary_drag_piece_position_y);

			this.matrix_pieces[this.click_drag_piece_position_y][this.click_drag_piece_position_x] = this.secondary_drag_piece;
			this.matrix_pieces[this.secondary_drag_piece_position_y][this.secondary_drag_piece_position_x] = this.click_drag_piece;

			// Set full color
			$(this.secondary_drag_piece.element).css('opacity', 1);
			
			if (this.hasCombinationWithNewMove()){
				
				this.removePieces();

				this.fallPieces();

				this.makeNewPieces();
				// Set new limit
				this.click_drag_piece.setUpNewLimit();
				this.secondary_drag_piece.setUpNewLimit();
				
				this.click_drag_piece = null;
				this.secondary_drag_piece = null;
				this.has_changed = false;

				// this.verifyWin();
			}
			else{
				this.matrix_pieces[this.click_drag_piece_position_y][this.click_drag_piece_position_x] = this.click_drag_piece;
				this.matrix_pieces[this.secondary_drag_piece_position_y][this.secondary_drag_piece_position_x] = this.secondary_drag_piece;

				$(this.secondary_drag_piece.element).draggable({ disabled: true });
				$(this.click_drag_piece.element).draggable({ disabled: true });
				this.secondary_drag_piece.movePositions(this.secondary_drag_piece_position_x, this.secondary_drag_piece_position_y);
				this.secondary_drag_piece.moveInCssWithAnimations(this.secondary_drag_piece_position_x, this.secondary_drag_piece_position_y);
	    		
	    		this.click_drag_piece.movePositions(this.click_drag_piece_position_x, this.click_drag_piece_position_y);
				this.click_drag_piece.moveInCssWithAnimations(this.click_drag_piece_position_x, this.click_drag_piece_position_y);
			}
		}
	}

	this.removePieces = function(){
		var arrayPositions = this.verifyIfMatch(this.click_drag_piece_position_x, this.click_drag_piece_position_y);
		
		if (!arrayPositions[0]){
			arrayPositions = this.verifyIfMatch(this.secondary_drag_piece_position_x, this.secondary_drag_piece_position_y);
		}

		var arrayLength = 3;
		if (arrayPositions[3]){
			arrayLength = 4;
			if (arrayPositions[4]){
				arrayLength = 5;
			}
		}
		for(var i = 0; i < arrayLength; i++){
			this.matrix_pieces[arrayPositions[i]['y']][arrayPositions[i]['x']].deletePiece();
			this.matrix_pieces[arrayPositions[i]['y']][arrayPositions[i]['x']] = null;
		}
	}

	this.fallPieces = function(){
		for (var line = 0; line < this.size_y; line++){
			for (var column = 0; column < this.size_x; column++){
				if (this.matrix_pieces[line][column] == null){
					for (var lineAux = line; lineAux > 0; lineAux--){
						if (this.matrix_pieces[lineAux - 1][column] != null){
							var index = getRandomIndex(quantity_of_types);
							this.matrix_pieces[lineAux][column] = this.matrix_pieces[lineAux - 1][column];
							this.matrix_pieces[lineAux][column].movePositions(column, lineAux);
							this.matrix_pieces[lineAux][column].moveInCssWithAnimations(column, lineAux);
							this.matrix_pieces[lineAux - 1][column] = null;
						}
					}
				}
			}
		}
	}

	this.makeNewPieces = function(){
		for (var line = 0; line < this.size_y; line++){
			for (var column = 0; column < this.size_x; column++){
				if (this.matrix_pieces[line][column] == null){
					var index = getRandomIndex(quantity_of_types);
					this.matrix_pieces[line][column] = new Piece(column, line, this.types[index],this.colors[index], null/*this.images[index]*/, this);
					this.matrix_pieces[line][column].element = this.matrix_pieces[line][column].createUi();
					this.matrix_pieces[line][column].setupImage();
					this.grid_element.append(this.matrix_pieces[line][column].element);
					this.matrix_pieces[line][column].setupCss();
				}
			}
		}
	}

	this.hasCombinationWithNewMove = function(){
		var arrayPieces = this.verifyIfMatch(this.click_drag_piece_position_x, this.click_drag_piece_position_y);
		if (arrayPieces[0])
			return true;
		
		arrayPieces = this.verifyIfMatch(this.secondary_drag_piece_position_x, this.secondary_drag_piece_position_y);
		if (arrayPieces[0])
			return true;
		return false;
	}

	// Function implements draggable.start() in jquery ui 
	this.clickPiece = function(self, event, ui){
		self.x_current_piece_moving = event.originalEvent.pageX;
		self.y_current_piece_moving = event.originalEvent.pageY;
		
		this.click_drag_piece = self;
		$(this.click_drag_piece.element).css('opacity', 0.5);
		
		this.click_drag_piece_position_x = (ui.originalPosition.left - this.grid_element.position().left) / this.cell_size;
		this.click_drag_piece_position_y = (ui.originalPosition.top - this.grid_element.position().top) / this.cell_size;
	}

	// Function implements draggable.drag() in jquery ui
	this.dragPiece = function(pieceInstance, ui, event, thisDraggable){
		$(this.click_drag_piece.element).css('opacity', 0.5);

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

	// Function implements draggable.stop() in jquery ui
	this.dropPiece = function(pieceInstance, thisDraggable){
		pieceInstance.x_current_piece_moving = pieceInstance.y_current_piece_moving = null;
        $(thisDraggable).draggable('option', 'axis', false);
	}

	this.verifyIfMatch = function (position_x, position_y){
		// TODO: Can match with 3 or 4 or 5
		var ifMatch = false;
		var columnLimit = 1, lineLimit = 1;
		var arrayPositions = new Array(5);
		for (var column = -2; column < columnLimit; column++){
			if(ifMatch){
				break;
			}

			// adjust the limits
			while (position_x + column < 0){
				column++;
			}
			while (position_x + columnLimit + 1 >= this.size_x){
				columnLimit--;
			}

			if (this.matrix_pieces[position_y][position_x + column].type_piece == this.matrix_pieces[position_y][position_x + column + 1].type_piece
				&&  this.matrix_pieces[position_y][position_x + column].type_piece == this.matrix_pieces[position_y][position_x + column + 2].type_piece) {
				arrayPositions[0] = {'x': position_x + column, 'y': position_y};
				arrayPositions[1] = {'x': position_x + column + 1, 'y': position_y};
				arrayPositions[2] = {'x': position_x + column + 2, 'y': position_y};
				
				if (position_x + column > 0){
					if (this.matrix_pieces[position_y][position_x + column].type_piece == this.matrix_pieces[position_y][position_x + column - 1].type_piece){
						arrayPositions[3] = arrayPositions[2];
						arrayPositions[2] = arrayPositions[1];
						arrayPositions[1] = arrayPositions[0];
						arrayPositions[0] = {'x': position_x + column - 1, 'y': position_y};
					}
				}
				if (position_x + column + 3 < this.size_x){
					if (this.matrix_pieces[position_y][position_x + column].type_piece == this.matrix_pieces[position_y][position_x + column + 3].type_piece){
						if (arrayPositions[3]){
							arrayPositions[4] = {'x': position_x + column + 3, 'y': position_y};
						}
						else{
							arrayPositions[3] = {'x': position_x + column + 3, 'y': position_y};
						}
					}
				}

				ifMatch = true;
			}

		}

		for (var line = -2; line < lineLimit; line++){
			if(ifMatch){
				break;
			}

			// adjust the limits
			while (position_y + line < 0){
				line++;
			}
			while (position_y + lineLimit + 1 >= this.size_y){
				lineLimit--;
			}

			if (this.matrix_pieces[position_y + line][position_x].type_piece == this.matrix_pieces[position_y + line + 1][position_x].type_piece
			&&  this.matrix_pieces[position_y + line][position_x].type_piece == this.matrix_pieces[position_y + line + 2][position_x].type_piece) {
				arrayPositions[0] = {'x': position_x, 'y': position_y + line};
				arrayPositions[1] = {'x': position_x, 'y': position_y + line + 1};
				arrayPositions[2] = {'x': position_x, 'y': position_y + line + 2};
				
				if (position_y + line > 0){
					if (this.matrix_pieces[position_y + line][position_x].type_piece == this.matrix_pieces[position_y + line - 1][position_x].type_piece){
						arrayPositions[3] = arrayPositions[2];
						arrayPositions[2] = arrayPositions[1];
						arrayPositions[1] = arrayPositions[0];
						arrayPositions[0] = {'x': position_x, 'y': position_y + line - 1};
					}
				}
				if (position_y + line + 3 < this.size_y){
					if (this.matrix_pieces[position_y + line][position_x].type_piece == this.matrix_pieces[position_y + line + 3][position_x].type_piece){
						if (arrayPositions[3]){
							arrayPositions[4] = {'x': position_x, 'y': position_y + line + 3};
						}
						else{
							arrayPositions[3] = {'x': position_x, 'y': position_y + line + 3};
						}
					}
				}

				ifMatch = true;
			}

		}

		return arrayPositions;
	}

}

function createMatrixOfPieces(size_x, size_y){
	var matrix_pieces = new Array(size_y);
	for (var line = 0; line < size_y; line++){
		matrix_pieces[line] = new Array(size_x);
	}
	return matrix_pieces;
}

function getRandomIndex(quantity_of_types) {
    return Math.floor(Math.random() * quantity_of_types);
}

function arrayOfTypes(quantity_of_types) {
	var array = new Array(quantity_of_types);
	var char_type = 'A';
	for (var i = 0; i < quantity_of_types; i++){
		array[i] = char_type;
		char_type = char_type + 'A';
	}
	return array;
}