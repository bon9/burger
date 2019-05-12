import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false
};

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

const priceSetIngredients = (ingredients) => {
	const sum = Object.keys(ingredients) // ['salad', 'bacon']
			.map(igKey => {
				return ingredients[igKey]*INGREDIENT_PRICES[igKey]// [5, 3]
			})
			.reduce((sum, el) => {
				return sum + el; // [0 + 5 + 3]
			}, initialState.totalPrice);
		return sum;
}

const addIngredient = (state,action) => {
		const updateIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
		const updateIngredients = updateObject(state.ingredients, updateIngredient)
		const updatedState = {
			ingredients: updateIngredients,
			totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
		}
		return updateObject(state, updatedState)
}

const setIngredients = (state,action)=> {
	return updateObject(state, {
		ingredients: {
			salad: action.ingredients.salad,
			bacon: action.ingredients.bacon,
			cheese: action.ingredients.cheese,
			meat: action.ingredients.meat
		},
		error: false,
		totalPrice: priceSetIngredients(action.ingredients)
	})
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT: return addIngredient(state,action);
		case actionTypes.REMOVE_INGREDIENT: // можно так же как и add, но оставил для примера
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1
				},
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
			}
		case actionTypes.SET_INGREDIENTS: return setIngredients(state,action)
		case actionTypes.FETCH_INGREDIENTS_FAILED: return updateObject(state, {error: true})
		default: return state;
	}
};

export default reducer;
