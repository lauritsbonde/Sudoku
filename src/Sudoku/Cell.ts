export default class Cell {
	value: number;
	row: number;
	col: number;
	tried: Array<number>;
	hidden: boolean;
	manuallySet: boolean;

	constructor(value: number, row: number, col: number) {
		this.value = value;
		this.row = row;
		this.col = col;
		this.tried = [];
		this.hidden = false;
		this.manuallySet = false;
	}

	reset() {
		this.value = 0;
		this.tried = [];
	}

	solveReset() {
		this.reset();
		this.hidden = true;
	}
}
