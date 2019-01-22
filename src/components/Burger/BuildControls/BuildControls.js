import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
	{ label: 'Salad', type: 'salad' },
	{ label: 'Bacon', type: 'bacon' },
	{ label: 'Cheese', type: 'cheese' },
	{ label: 'Meat', type: 'meat' }
];

const buildControls = (props) => (
	<div className={classes.BuildControls}>
		{controls.map(ctrl => ( // выведим каждый ингридиент с кнопками
			<BuildControl key={ctrl.label} label={ctrl.label} />
		))}
	</div>
);

export default buildControls;