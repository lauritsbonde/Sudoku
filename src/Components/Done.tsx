import React from 'react';

interface IProps {
	done: boolean;
	impossible: boolean;
	solver: boolean;
	exportGrid: () => void;
}

const Done: React.FC<IProps> = ({ done, impossible, solver, exportGrid }) => {
	return (
		<div>
			{done && <h3>{solver ? 'Solved!' : 'FIlled!'} 🏆</h3>}
			{impossible && <h3>Impossible! 🤯</h3>}
			{done && !solver && (
				<button
					onClick={() => {
						exportGrid();
					}}
				>
					Export grid
				</button>
			)}
		</div>
	);
};

export default Done;
