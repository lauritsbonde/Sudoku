import React from 'react';

interface IProps {
	switchMode: () => void;
	putValue: () => void;
	setAuto: (auto: boolean) => void;
	setAutoInterval: (autoInterval: number) => void;
	auto: boolean;
	done: boolean;
	solver: boolean;
	hiddenPercentage: number;
	autoInterval: number;
	hideValues: (e: React.ChangeEvent<HTMLInputElement>) => void;
	importGrid: (e: React.ChangeEvent<HTMLInputElement>) => void;
	importGridString: string;
	instantSolve: () => void;
}

const Settings: React.FC<IProps> = ({ switchMode, putValue, setAuto, setAutoInterval, done, solver, hiddenPercentage, hideValues, auto, autoInterval, importGrid, importGridString, instantSolve }) => {
	return (
		<div>
			<h2>{solver ? 'Solve Mode' : 'Make Mode'}</h2>
			<p>
				Import grid: <input type="text" value={importGridString} onChange={(e) => importGrid(e)} />
			</p>
			<button
				onClick={() => {
					switchMode();
				}}
			>
				Switch to {solver ? 'Make' : 'Solve'} mode
			</button>
			{!done && (
				<>
					<p>
						Place next value: <button onClick={() => putValue()}>setValue</button>
					</p>
					<p>
						Autofill: <button onClick={() => setAuto(!auto)}>{auto ? 'stop' : 'start'}</button> Speed:{' '}
						<input type="range" min="5" max="1000" step="5" value={autoInterval} onChange={(e) => setAutoInterval(Number(e.target.value))} />
						{' ' + (1000 - autoInterval)}
					</p>
					<p>
						Instant solve: <button onClick={() => instantSolve()}>Solve</button>
					</p>
				</>
			)}
			{done && !solver && (
				<p>
					Shown numbers:
					<input type="range" step="1" min="0" max="81" value={hiddenPercentage} onChange={(e) => hideValues(e)} />
					{hiddenPercentage}
				</p>
			)}
		</div>
	);
};

export default Settings;
