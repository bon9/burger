import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

	const transformIngredients = Object.keys(props.ingredients)
		//Object.keys() извлекает ключи данного объекта и превращает их в массив
		//cheese: 2 = cheese 
		.map(igKey => {
			// igKey = cheese
			return [...Array(props.ingredients[igKey])]
				// Array(n) создаёт массив с n-элементов
				// props.ingredients[igKey]) = 2
				// return [undefined, indefined] 
				.map((_, i) => {
					//первый аргумент нам тут не нужен, поэтому _
					return <BurgerIngredient key={igKey + i} type={igKey} />
					// key = cheese2, type = cheese
				})
		});
	console.log(transformIngredients);

	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default burger;