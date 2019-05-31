import React, { useEffect, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import * as actions from "./store/actions/index";

const Checkout = React.lazy(() => {
  return import("./containers/Checkout/Checkout");
});

const Orders = React.lazy(() => {
  return import("./containers/Orders/Orders");
});

const Logout = React.lazy(() => {
  return import("./containers/Auth/Logout/Logout");
});

const Auth = React.lazy(() => {
  return import("./containers/Auth/Auth");
});

const App = props => {
  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  let routes = (
    <Switch>
      <Route path="/auth" render={props => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );
  if (props.isAuth) {
    routes = (
      <Switch>
        <Route path="/checkout" render={props => <Checkout {...props} />} />
        <Route path="/auth" render={props => <Auth {...props} />} />
        <Route path="/orders" render={props => <Orders {...props} />} />
        <Route path="/logout" render={props => <Logout {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading ...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

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
