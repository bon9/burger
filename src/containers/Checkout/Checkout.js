import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
	state = {
		ingredients: null,
		totalPrice: 0
	}

	componentWillMount() {
		console.log(this.props);
		//example: location.search = ?bacon=2&cheese=3&meat=1&salad=1
		const query = new URLSearchParams(this.props.location.search);
		const ingredients = {};
		let price = 0;
		//  entries проходит через все пары ключ-значения
		for (let param of query.entries()) {
			if (param[0] === 'price') { // обходной путь для получения суммы
				price = param[1];
			} else {
				// ['salad', '1']
				ingredients[param[0]] = +param[1];
				// {salad: 1}
			}
		}
		this.setState({ ingredients, totalPrice: price });
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		return (
			<div>
				<CheckoutSummary
					ingredients={this.state.ingredients}
					checkoutCancelled={this.checkoutCancelledHandler}
					checkoutContinued={this.checkoutContinuedHandler} />
				<Route
					path={this.props.match.path + '/contact-data'}
					// если хотив передать пропс, то не component{ContactData}
					// а render={() => (<ContactData />)}
					render={(props) => (
						// в props передается history, match и тд
						<ContactData
							ingredients={this.state.ingredients}
							price={this.state.totalPrice}
							{...props} />
					)} />
			</div>
		);
	}

}

export default Checkout;