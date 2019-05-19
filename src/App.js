import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import * as actions from "./store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
  return import("./containers/Checkout/Checkout");
});

const asyncOrders = asyncComponent(() => {
  return import("./containers/Orders/Orders");
});

const asyncLogout = asyncComponent(() => {
  return import("./containers/Auth/Logout/Logout");
});

const asyncAuth = asyncComponent(() => {
  return import("./containers/Auth/Auth");
});
class App extends Component {
  // state = {
  // 	show: true
  // };
  // componentDidMount() {
  // 	setTimeout(() => {
  // 		this.setState({ show: false })
  // 	}, 5000);
  // }
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={asyncLogout} />
          <Route path="/" exact component={BurgerBuilder} />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
