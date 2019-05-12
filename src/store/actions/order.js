import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	}
}

const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: error
	}
}

const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	}
}

export const purchaseBurger = (orderData) => {
	return dispatch => {
		dispatch(purchaseBurgerStart());
		axios.post('/orders.json', orderData) // отправить
			.then(response => {
				console.log(orderData);
				dispatch(purchaseBurgerSuccess(response.data.name, orderData))
			})
			.catch(error => {
				dispatch(purchaseBurgerFail(error))
			});
	}
}

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	}
}

//------ ORDERS

const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	}
}

const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	}
}

const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: error
	}
}

export const fetchOrders = () => {
	return dispatch => {
		dispatch(fetchOrdersStart());
		axios.get('orders.json')
			.then(response => {
				const fetchedOrders = [];
				for (let key in response.data) {
					fetchedOrders.push({
						...response.data[key],
						id: key
					});
				}
				dispatch(fetchOrdersSuccess(fetchedOrders))
			})
			.catch(err => {
				dispatch(fetchOrdersFail(err))
			})
	}
}

//------ ORDERS DELETE
const delOrder = (id) => {
	return {
		type: actionTypes.DELETE_ORDER,
		id: id
	}
}

export const getDeleteOrder = (idOrder) => {
	console.log(idOrder);
	return dispatch => {
		dispatch(delOrder(idOrder));
		axios.delete('/orders/'+idOrder+'.json');
	}
}