import React from 'react';

interface IProps {
	possibleValues: number[];
	done: boolean;
	manuallySet: boolean;
}

const Value: React.FC<IProps> = ({ possibleValues, done, manuallySet }) => {
	const allValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const tdStyle = { border: '1px solid black', padding: '2%', width: 100 / 9 + '%', textAlign: 'center' } as React.CSSProperties;

	return (
		<div>
			<p>Possible values: </p>
			<table style={{ width: '30vw' }}>
				<tbody>
					<tr>
						{allValues.map((value) => (
							<td style={{ ...tdStyle, backgroundColor: possibleValues.includes(value) ? '#00ff00' : '#ff0000' }} key={value}>
								{value}
							</td>
						))}
					</tr>
				</tbody>
			</table>
			{manuallySet && <h3>Manually set</h3>}
			{possibleValues.length === 0 && !done && !manuallySet && <h3>Backtrack!</h3>}
		</div>
	);
};

export default Value;
