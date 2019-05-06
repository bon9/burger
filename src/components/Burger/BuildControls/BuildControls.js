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
		<p>Current Price: <strong>{props.price}</strong></p>
		{controls.map(ctrl => ( // выведим каждый ингридиент с кнопками
			<BuildControl // и передадим в каждый свои пропсы
				key={ctrl.label}
				label={ctrl.label}
				added={() => props.ingredientAdded(ctrl.type)}
				removed={() => props.ingredientRemoved(ctrl.type)}
				disabled={props.disabled[ctrl.type]} /> // disabled = true/false
		))}
		<button
			className={classes.OrderButton}
			disabled={!props.purchaseble}
			onClick={props.ordered}>Order now</button>
	</div>
);

export default buildControls;