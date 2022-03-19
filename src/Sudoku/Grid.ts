import Cell from './Cell';

interface place {
	row: number;
	col: number;
}

class Grid {
	grid: Array<Array<Cell>>;
	finished: boolean;

	constructor() {
		this.grid = [];
		for (let i = 0; i < 9; i++) {
			let row = [];
			for (let j = 0; j < 9; j++) {
				row.push(new Cell(0, i, j));
			}
			this.grid.push(row);
		}
		this.finished = false;
	}

	setGrid(newGrid: Array<Array<Cell>>, solver: boolean) {
		if (!solver) {
			for (let i = 0; i < newGrid.length; i++) {
				for (let j = 0; j < newGrid[i].length; j++) {
					this.grid[i][j] = new Cell(newGrid[i][j].value, i, j);
				}
			}
			this.finished = true;
		} else {
			for (let i = 0; i < newGrid.length; i++) {
				for (let j = 0; j < newGrid[i].length; j++) {
					if (newGrid[i][j].hidden) {
						this.grid[i][j] = new Cell(0, i, j);
					} else {
						this.grid[i][j] = new Cell(newGrid[i][j].value, i, j);
						this.grid[i][j].manuallySet = true;
					}
				}
			}
			this.finished = false;
		}
	}

	instantFill() {
		const currentPos = { row: 0, col: 0 };
		while (!this.finished) {
			if (this.setValue(currentPos) === 0) {
				this.backtrack(currentPos);
				currentPos.col--;

				if (currentPos.col < 0) {
					currentPos.row--;
					currentPos.col = 8;
				}
			} else {
				currentPos.col++;
				if (currentPos.col > 8) {
					currentPos.row++;
					currentPos.col = 0;
				}
			}
		}
	}

	setValue(p: place): number {
		const possibleValues = this.getPossibleValues(p);

		if (possibleValues.length === 0) {
			return 0;
		}

		const randomIndex = Math.floor(Math.random() * possibleValues.length);
		const value = possibleValues[randomIndex];

		this.grid[p.row][p.col].value = value;
		this.grid[p.row][p.col].tried.push(value);

		if (p.row === 8 && p.col === 8) {
			this.finished = true;
		}

		return value;
	}

	getPossibleValues(p: place): Array<number> {
		const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		if (p.row < 0 || p.row > 8) {
			return [];
		}

		//check tried
		for (let i = 0; i < this.grid[p.row][p.col].tried.length; i++) {
			const triedValue = this.grid[p.row][p.col].tried[i];
			const index = possibleValues.indexOf(triedValue);
			if (index > -1) {
				possibleValues.splice(index, 1);
			}
		}

		//check row
		const row = this.grid[p.row];
		for (let i = 0; i < row.length; i++) {
			if (row[i].value) {
				const index = possibleValues.indexOf(row[i].value);
				if (index > -1) {
					possibleValues.splice(index, 1);
				}
			}
		}

		//check column
		for (let i = 0; i < this.grid.length; i++) {
			if (this.grid[i][p.col].value) {
				const index = possibleValues.indexOf(this.grid[i][p.col].value);
				if (index > -1) {
					possibleValues.splice(index, 1);
				}
			}
		}

		//check square
		let squareRow = Math.floor(p.row / 3) * 3;
		let squareCol = Math.floor(p.col / 3) * 3;
		for (let i = squareRow; i < squareRow + 3; i++) {
			for (let j = squareCol; j < squareCol + 3; j++) {
				if (this.grid[i][j].value) {
					const index = possibleValues.indexOf(this.grid[i][j].value);
					if (index > -1) {
						possibleValues.splice(index, 1);
					}
				}
			}
		}
		return possibleValues;
	}

	backtrack(p: place) {
		this.grid[p.row][p.col].reset();
	}

	setShown(amount: number) {
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				this.grid[i][j].hidden = false;
			}
		}

		for (let i = 0; i < 81 - amount; i++) {
			let row = Math.floor(Math.random() * 9);
			let col = Math.floor(Math.random() * 9);

			while (this.grid[row][col].hidden) {
				row = Math.floor(Math.random() * 9);
				col = Math.floor(Math.random() * 9);
			}

			this.grid[row][col].hidden = true;
		}
		return this.grid;
	}

	setCellValue(p: place, value: number) {
		this.grid[p.row][p.col].value = value;
		this.grid[p.row][p.col].manuallySet = true;
	}
}

export { Grid };
export type { place };
