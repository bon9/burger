import React from 'react';
// если нужен прямой доступ к match в любом месте и не хотим передавать в ручную
// оборачиваем експорт в withRouter
// import { withRouter } from 'react-router-dom';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

	let transformIngredients = Object.keys(props.ingredients)
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
				});
		})
		.reduce((arr, el) => {
			// reduce принимает функцию в кач-ве входных данных, которая выполняется на каждому элементе массива
			// и эта ф-ция получает 2 аргумента (prev, curr) автоматически передаваемых в js. 
			// А так же 2м аргументом reduce принимает начальное значение, у нас это [].
			return arr.concat(el)
			// пройдем по всем эл-там и добавим их в начальное значение. Каждый шаг новое значение
			// вместо [] передаётся в аргумент arr
		}, []);
	
	if (transformIngredients.length === 0) {
		transformIngredients = <p>Please start adding ingredients!</p>
	}

	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top" />
			{transformIngredients}
			<BurgerIngredient type="bread-bottom" />
		</div>
	);
};

export default burger;
// export default withRouter(burger);