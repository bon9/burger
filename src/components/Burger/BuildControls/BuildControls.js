import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index'

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';
import Button from '../../UI/Button/Button';

const controls = [
	{ label: 'Salad', type: 'salad' },
	{ label: 'Bacon', type: 'bacon' },
	{ label: 'Cheese', type: 'cheese' },
	{ label: 'Meat', type: 'meat' }
];

const buildControls = (props) => {

	const randomInteger = (min, max) => {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

	const randomOrder = {
		ingredients: {
			bacon: randomInteger(1,2),
			cheese: randomInteger(1,3),
			meat: randomInteger(1,3),
			salad: randomInteger(2,5)
		},
		orderData: {
			name: 'Oleh',
			country: 'ukr',
			deliveryMethod: 'fastest',
			email: 'oleh@2',
			street: 'Suv',
			zipCode: '345'
		},
		price: randomInteger(5,15)
	}
		

	return (
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
				<Button btnType='Success' clicked={() => props.randomOrder(randomOrder)}>Random</Button>
		</div>
	)
}

const mapDispatchToProps = dispatch => {
	return { 
		randomOrder: (randomOrder) => dispatch(actions.purchaseBurger(randomOrder))
	}
}	

export default connect(null,mapDispatchToProps)(buildControls);