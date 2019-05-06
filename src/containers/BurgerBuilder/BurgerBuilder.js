import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/action';

class BurgerBuilder extends Component {
	state = {
		purchasing: false, // отображение orderSummary
		loading: false, // for spinner
		error: false
	}

	componentDidMount() {
		// axios.get('/ingredients.json') 
		// 	.then(response => {
		// 		this.priceCalculation(response.data);
		// 	})
		// 	.catch(error => {
		// 		this.setState({ error: true });
		// 		// this.setState({ ingredients: { 'salad': 0, 'bacon': 0, 'cheese': 0, 'meat': 0 } })
		// 	})
	}

/*
	priceCalculation(ingredients) {
		// const updatedIngredients = {
		// 	...ingredients
		// };
		const defaultPrice = this.state.totalPrice;
		const dataPrice = Object.keys(ingredients) // ['salad', 'bacon']
			.map(igKey => { // igKey = bacon и т.д.
				return ingredients[igKey] * INGREDIENT_PRICES[igKey]; // количество * цену
			})
			.reduce((sum, el) => {
				return sum + el; // [0 + 5 + 3]
			}, defaultPrice);

		this.setState({
			totalPrice: dataPrice,
			purchaseble: dataPrice > defaultPrice,
			ingredients
		});
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
		this.updatePurchaseState(updatedIngredients);
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
		this.updatePurchaseState(updatedIngredients);
	}
	*/

	updatePurchaseState = (ingredients) => {
		// salad: 5, bacon: 3 ..
		const sum = Object.keys(ingredients) // ['salad', 'bacon']
			.map(igKey => {
				return ingredients[igKey] // [5, 3]
			})
			.reduce((sum, el) => {
				return sum + el; // [0 + 5 + 3]
			}, 0);
		// purchaseble: true if sum > 0
		return sum > 0;
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHadler = () => {
		this.props.history.push('/checkout');
	}

	render() {
		const disabledInfo = {
			// props.ings получаем с connect
			...this.props.ings // копируем текущее сост
		};
		// присвоим каждому ключу (ингредиенту) true/false
		// {salad: true, meat: false, ...}
		for (let key in disabledInfo) {
			// disabledInfo[key] = true если disabledInfo[key] <= 0
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		let orderSummary = null;
		let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

		// как только ингридиенты считываются с базы в стейт, то выводи ...
		if (this.props.ings) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
					//аргумент для ingName передается в самом BuildControls
						ingredientAdded={this.props.onIngredientAdd}
						ingredientRemoved={this.props.onIngredientRemove}
						disabled={disabledInfo} // Less button on/off
						price={this.props.price}
						purchaseble={this.updatePurchaseState(this.props.ings)} // Order button active on/off
						ordered={this.purchaseHandler}  // Order button click
					/>
				</Aux>
			);
			orderSummary = <OrderSummary
				ingredients={this.props.ings}
				// кнопка Cancel в модальном 
				purchaseCancelled={this.purchaseCancelHandler}
				// кнопка Continue в модальном 
				purchaseContinued={this.purchaseContinueHadler}
				price={this.props.price} />
			if (this.state.loading) {
				orderSummary = <Spinner />;
			}
		}

		return (
			<Aux>
				<Modal
					// отображение модального окна 
					show={this.state.purchasing}
					// фон при активном модальном окне
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice.toFixed(2)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdd: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
		onIngredientRemove: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
