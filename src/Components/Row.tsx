import React from 'react';
import Cell from './Cell';
import sCell from '../Sudoku/Cell';
import { place } from '../Sudoku/Grid';

interface props {
	row: Array<sCell>;
	head: { row: number; col: number };
	done: boolean;
	solver: boolean;
	setValue: (p: place, value: number) => void;
}

const Row: React.FC<props> = ({ row, head, done, solver, setValue }) => {
	const style = {
		width: '100%',
		height: 100 / 9 + '%',
	} as React.CSSProperties;

	return (
		<tr style={style}>
			{row.map((c, cellIndex) => {
				return <Cell key={cellIndex} cell={c} head={head} done={done} solver={solver} setValue={setValue} />;
			})}
		</tr>
	);
};

export default Row;
