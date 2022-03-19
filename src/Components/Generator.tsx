import React, { useState, useEffect } from 'react';
import Row from './Row';
import { Grid, place } from '../Sudoku/Grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Value from './Value';
import Settings from './Settings';
import Done from './Done';

const Generator = () => {
	const [sudoku, setSudoku] = useState(new Grid());
	const [grid, setGrid] = useState(sudoku.grid);

	const [position, setPosition] = useState({ row: 0, col: 0 });
	const [lastDirection, setLastDirection] = useState('forward');
	const [availableNumbers, setAvailableNumbers] = useState(sudoku.getPossibleValues(position));

	const [hiddenPercentage, setHiddenPercentage] = useState(81);

	const [auto, setAuto] = useState(false);
	const [autoInterval, setAutoInterval] = useState(30);

	const [solver, setSolver] = useState(true);

	const [done, setDone] = useState(false);
	const [impossible, setImpossible] = useState(false);

	const [importGridString, setImportGridString] = useState('');

	const switchMode = () => {
		const newSudoku = new Grid();
		setSudoku(newSudoku);
		setSolver(!solver);
		setGrid(newSudoku.grid);
		setPosition({ row: 0, col: 0 });
		setDone(false);
		setImpossible(false);
		setAvailableNumbers(newSudoku.getPossibleValues(position));
		setImportGridString('');
	};

	const exportGrid = () => {
		if (done) {
			navigator.clipboard.writeText(JSON.stringify(grid));
			toast.success('Copied grid to clipboard');
		} else {
			toast.error('Grid not done yet');
		}
	};

	const importGrid = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newGrid = JSON.parse(e.target.value);
		if (newGrid.length === 9 && newGrid[0].length === 9) {
			const newSudoku = new Grid();
			newSudoku.setGrid(newGrid, solver);
			setSudoku(newSudoku);
			setGrid(newSudoku.grid);
			setPosition(solver ? { row: 0, col: 0 } : { row: 8, col: 8 });
			setDone(solver ? false : true);
			setImportGridString(e.target.value);
			toast.success('Imported grid');
		} else {
			toast.error('Invalid grid');
		}
	};

	useEffect(() => {
		if (auto) {
			const interval = setInterval(() => {
				putValue();
			}, autoInterval);
			return () => clearInterval(interval);
		}
	});

	const hideValues = (e: React.ChangeEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setHiddenPercentage(+value);
		setGrid([...sudoku.setShown(+value)]);
	};

	//TODO: clean this up - it is ugly and confusing
	const putValue = () => {
		if (done) {
			toast.success('Sudoku is ' + (solver ? 'solved' : 'filled') + '! ✅');
			setAuto(false);
			return;
		}
		if (impossible) {
			toast.error('Sudoku is impossible!❌');
			setAuto(false);
			return;
		}
		if (sudoku.grid[position.row][position.col].manuallySet) {
			if (lastDirection === 'forward') {
				const newPos = position;
				newPos.col++;
				if (newPos.col === 9) {
					newPos.col = 0;
					newPos.row++;
				}
				setPosition(newPos);
				setGrid([...sudoku.grid]);
				setLastDirection('forward');
			} else {
				const newPos = position;
				newPos.col--;
				if (newPos.col === -1) {
					newPos.col = 8;
					newPos.row--;
				}
				setPosition(newPos);
				setGrid([...sudoku.grid]);
				setLastDirection('backward');
			}
		} else if (sudoku.setValue(position) !== 0) {
			const newPos = position;
			newPos.col++;
			if (newPos.col === 9) {
				newPos.col = 0;
				newPos.row++;
			}
			setPosition(newPos);
			setGrid([...sudoku.grid]);
			setLastDirection('forward');
			setDone(newPos.row === 9);
			setAvailableNumbers(sudoku.getPossibleValues(newPos));
		} else {
			// backtrack
			sudoku.backtrack(position);
			setGrid([...sudoku.grid]);

			const newPos = position;
			newPos.col--;
			if (newPos.col === -1) {
				newPos.col = 8;
				newPos.row--;
			}
			if (newPos.row === -1) {
				setImpossible(true);
			}
			setLastDirection('backward');
			setPosition(newPos);
			setAvailableNumbers(sudoku.getPossibleValues(newPos));
		}
	};

	const setValue = (p: place, value: number) => {
		if (checkValue(p, value)) {
			sudoku.setCellValue(p, value);
			setGrid([...sudoku.grid]);
		} else {
			toast.warn('This value is not allowed');
		}
	};

	const checkValue = (p: place, value: number) => {
		if (value < 0 || value > 9) return false;

		// check row
		const row = sudoku.grid[p.row];
		for (let i = 0; i < 9; i++) {
			if (row[i].value === value) {
				return false;
			}
		}

		// check column
		for (let i = 0; i < 9; i++) {
			if (sudoku.grid[i][p.col].value === value) {
				return false;
			}
		}

		// check box
		const startCol = Math.floor(p.col / 3) * 3;
		const startRow = Math.floor(p.row / 3) * 3;
		for (let i = startRow; i < startRow + 3; i++) {
			for (let j = startCol; j < startCol + 3; j++) {
				if (sudoku.grid[i][j].value === value) {
					return false;
				}
			}
		}

		return true;
	};

	const instantSolve = () => {
		if (done || impossible) return;
		const oldSuduko = sudoku;
		oldSuduko.instantFill();
		setGrid([...oldSuduko.grid]);
		setDone(true);
		setSudoku(oldSuduko);
		setPosition({ row: 9, col: 0 });
		setLastDirection('forward');
	};

	const style = {
		borderCollapse: 'collapse',
		width: '600px',
		height: '600px',
		margin: '50px',
	} as React.CSSProperties;

	return (
		<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
			<ToastContainer />
			<div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
				<div>
					<Settings
						switchMode={switchMode}
						putValue={putValue}
						setAuto={setAuto}
						setAutoInterval={setAutoInterval}
						done={done}
						solver={solver}
						hiddenPercentage={hiddenPercentage}
						hideValues={hideValues}
						auto={auto}
						autoInterval={autoInterval}
						importGrid={importGrid}
						importGridString={importGridString}
						instantSolve={instantSolve}
					/>
					<Done done={done} impossible={impossible} solver={solver} exportGrid={exportGrid} />
				</div>
				<Value possibleValues={availableNumbers} done={done} manuallySet={position.row < 9 ? grid[position.row][position.col].manuallySet : false} />
			</div>
			<table style={style}>
				<tbody>
					{grid.map((row, rowIndex) => {
						return <Row key={rowIndex} row={row} head={position} done={done} solver={solver} setValue={setValue} />;
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Generator;
