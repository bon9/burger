import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './BurgerIngredient.css'

class BurgerIngregient extends Component {
	redner() {
		let ingredient = null;

		// исходя из пришедшего в props типа ингридиента, возвращаем JSX с соответствующими классами
		switch (this.props.type) {
			case ('bread-bottom'):
				ingredient = <div className={classes.BreadBottom}></div>;
				break;
			case ('bread-top'):
				ingredient = (
					<div className={classes.BreadTop}>
						<div className={classes.Seeds1}></div>
						<div className={classes.Seeds2}></div>
					</div>
				);
				break;
			case ('meat'):
				ingredient = <div className={classes.Meat}></div>;
				break;
			case ('cheese'):
				ingredient = <div className={classes.Cheese}></div>;
				break;
			case ('bacon'):
				ingredient = <div className={classes.Bacon}></div>;
				break;
			case ('salad'):
				ingredient = <div className={classes.Salad}></div>;
				break;
			default:
				ingredient = null;
		}

		return ingredient;
	}
}

// проверка на тип типа - должен быть строкой Обязательно
BurgerIngregient.propTypes = {
	type: PropTypes.string.isRequired
};

export default BurgerIngregient;