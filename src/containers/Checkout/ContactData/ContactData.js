import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {

	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		},
		loading: false
	}

	componentDidMount() {
		console.log('as', this.props);
	}

	orderHandler = (event) => {
		// убираем стандартное поведение - отправление при нажатии кнопки
		event.preventDefault();
		// включаем спиннер
		this.setState({ loading: true });

		// отправляемый заказ
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			customer: {
				name: 'Oleh D',
				address: {
					street: 'Suvorova',
					zipCode: '6542',
					country: 'Ukraine'
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fastes'
		}

		axios.post('/orders.json', order) // отправить
			.then(response => {
				// off spinner
				this.setState({ loading: false });
				// необходимо вначале передать пропс из Checkout > route > render
				this.props.history.push('/');
			})
			.catch(error => {
				// off spinner
				this.setState({ loading: false });
			});
	}

	render() {
		let form = (
			<form action="">
				<input className={classes.Input} type="text" name="name" placeholder="Your name" />
				<input className={classes.Input} type="email" name="email" placeholder="Your email" />
				<input className={classes.Input} type="text" name="street" placeholder="Your street" />
				<input className={classes.Input} type="text" name="postal" placeholder="Your postal code" />
				<Button btnType="Success" clicked={this.orderHandler}>Order</Button>
			</form>
		);
		if (this.state.loading) {
			form = <Spinner />
		}

		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

export default ContactData;