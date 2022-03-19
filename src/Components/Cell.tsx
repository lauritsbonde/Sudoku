import React from 'react';
import sCell from '../Sudoku/Cell';
import { place } from '../Sudoku/Grid';

interface props {
	cell: sCell;
	head: { row: number; col: number };
	done: boolean;
	solver: boolean;
	setValue: (p: place, value: number) => void;
}

const Cell: React.FC<props> = ({ cell, head, done, solver, setValue }) => {
	const style = {
		borderRight: (cell.col + 1) % 3 === 0 ? '3px solid black' : '1px solid black',
		borderBottom: (cell.row + 1) % 3 === 0 ? '3px solid black' : '1px solid black',
		borderLeft: cell.col === 0 ? '3px solid black' : '1px solid black',
		borderTop: cell.row === 0 ? '3px solid black' : '1px solid black',
		backgroundColor: cell.manuallySet ? '#00ff00' : head.row === cell.row && head.col === cell.col && !done ? '#ff0000' : '',
		textAlign: 'center',
		width: 100 / 9 + '%',
		height: 100 / 9 + '%',
		WebkitAppearance: 'none',
	} as React.CSSProperties;
	if (solver) {
		return (
			<td style={style}>
				<input
					style={{ width: '80%', height: '80%' }}
					type="number"
					value={!cell.hidden && cell.value !== 0 ? cell.value : ''}
					onChange={(e) => {
						setValue({ row: cell.row, col: cell.col }, +(e.target as HTMLInputElement).value);
					}}
				/>
			</td>
		);
	} else {
		return <td style={style}>{cell.hidden || cell.value === 0 ? '' : cell.value}</td>;
	}
};

export default Cell;
