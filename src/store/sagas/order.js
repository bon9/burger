import axios from "../../axios-orders";
import { put } from "redux-saga/effects";

import * as actions from "../actions";

export function* purchaseBurgerSaga(action) {
  yield put(actions.purchaseBurgerStart());
  try {
    const response = yield axios.post(
      "/orders.json?auth=" + action.token,
      action.orderData
    ); // отправить

    yield put(
      actions.purchaseBurgerSuccess(response.data.name, action.orderData)
    );
  } catch (error) {
    yield put(actions.purchaseBurgerFail(error));
  }
}

export function* fetchOrdersSaga(action) {
  yield put(actions.fetchOrdersStart());
  // правила в проэкте на firebase
  const queryParams = `?auth=${action.token}&orderBy="userId"&equalTo="${
    action.userId
  }"`;
  // console.log(queryParams);
  const response = yield axios.get("/orders.json" + queryParams);
  try {
    const fetchedOrders = [];
    for (let key in response.data) {
      fetchedOrders.push({
        ...response.data[key],
        id: key
      });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch (error) {
    put(actions.fetchOrdersFail(error));
  }
}

export function* getDeleteOrderSaga(action) {
  yield put(actions.deleteOrder(action.idOrder));
  yield axios.delete(
    "/orders/" + action.idOrder + ".json?auth=" + action.token
  );
}
