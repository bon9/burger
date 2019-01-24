import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type]; // старое кол-во
		const updatedCounted = oldCount + 1; // увеличиваем на 1
		const updatedIngredients = { // копируем, а не даём ссылку
			...this.state.ingredients
		};
		// в новом объекте присваиваем новое кол-во
		updatedIngredients[type] = updatedCounted;
		const priceAddition = INGREDIENT_PRICES[type]; // цена добавленного инг-та
		const oldPrice = this.state.totalPrice; // старая сумма
		const newPrice = oldPrice + priceAddition; // старая сумма + цена добавляемого инг-та
		// обновляем состояние
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) { // если не положительное число, сразу возвращаем
			return;
		}
		const updatedCounted = oldCount - 1;
		const updatedIngredients = { // копируем текущее сост, а не даём ссылку
			...this.state.ingredients
		};
		// в новом объекте присваиваем новое кол-во
		updatedIngredients[type] = updatedCounted;
		const priceDeduction = INGREDIENT_PRICES[type]; // цена добавленного инг-та
		const oldPrice = this.state.totalPrice; // старая сумма
		const newPrice = oldPrice - priceDeduction; // старая сумма + цена добавляемого инг-та
		// обновляем состояние
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients // копируем текущее сост
		};
		// присвоим каждому ключу (ингредиенту) true/false
		// {salad: true, meat: false, ...}
		for (let key in disabledInfo) {
			// disabledInfo[key] = true если disabledInfo[key] <= 0
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		return (
			<Aux>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					price={this.state.totalPrice} />
			</Aux>
		);
	}
}

export default BurgerBuilder;