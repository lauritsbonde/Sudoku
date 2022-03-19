import { place } from '../Sudoku/Grid';
import Cell from '../Sudoku/Cell';

class agent {
	actions: Array<action>;
	state: Array<Array<Cell>>;
	reward: number;

	constructor() {
		this.actions = [];
		this.state = [];
		this.reward = 0;
	}
}

class action {
	pos: place;
	value: number;

	constructor(pos: place, value: number) {
		this.pos = pos;
		this.value = value;
	}
}
