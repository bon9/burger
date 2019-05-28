import { put, delay, call } from "redux-saga/effects";
import axios from "axios";

import * as actions from "../actions";

export function* logoutSaga(action) {
  yield call([localStorage, "removeItem"], "token");
  yield call([localStorage, "removeItem"], "expirationDate");
  yield call([localStorage, "removeItem"], "userId");
  yield put(actions.logoutSecceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expiretionTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };
  const apiKey = "AIzaSyCe4zU0c2tViAbPHhTjcigPxtE0x1HE0FM";
  let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`;
  if (action.isSignup) {
    // если зареган то URL для проверки пароля
    url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`;
  }
  try {
    const response = yield axios.post(url, authData);
    // отправляем в Storage token и время до которого он будет действовать
    // expiresIn - кол-во секунд, которое будет действовать token пришедший
    const expirationDate = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );
    yield call([localStorage, "setItem"], "token", response.data.idToken);
    yield call([localStorage, "setItem"], "expirationDate", expirationDate);
    yield call([localStorage, "setItem"], "userId", response.data.localId);
    yield put(
      actions.authSuccess(response.data.idToken, response.data.localId)
    );
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(
      localStorage.getItem("expirationDate")
    );
    // expirationDate - время, в которое истечет ключ
    // new Date() - настоящее
    // если время в которое истечет ключ МЕНЬШЕ (т.е. уже прошло) чем сейчас, то логаут
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem("userId");
      yield put(actions.authSuccess(token, userId));
      yield put(
        actions.checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}
