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