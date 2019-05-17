import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as actions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchasing: false // отображение orderSummary
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState = ingredients => {
    // salad: 5, bacon: 3 ..
    const sum = Object.keys(ingredients) // ['salad', 'bacon']
      .map(igKey => {
        return ingredients[igKey]; // [5, 3]
      })
      .reduce((sum, el) => {
        return sum + el; // [0 + 5 + 3]
      }, 0);
    // purchaseble: true if sum > 0
    return sum > 0;
  };

  purchaseHandler = () => {
    if (this.props.isAuth) {
      this.setState({ purchasing: true });
    } else {
      // если auth = false устанавливаем authRedirectPath в state на /checkout
      // и перекидываем на стр auth
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHadler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      // props.ings получаем с connect
      ...this.props.ings // копируем текущее сост
    };
    // присвоим каждому ключу (ингредиенту) true/false
    // {salad: true, meat: false, ...}
    for (let key in disabledInfo) {
      // disabledInfo[key] = true если disabledInfo[key] <= 0
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );
    // как только ингридиенты считываются с базы в стейт, то выводи ...
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            //аргумент для ingName передается в самом BuildControls
            ingredientAdded={this.props.onIngredientAdd}
            ingredientRemoved={this.props.onIngredientRemove}
            disabled={disabledInfo} // Less button on/off
            price={this.props.price}
            purchaseble={this.updatePurchaseState(this.props.ings)} // Order button active on/off
            ordered={this.purchaseHandler} // Order button click
            isAuth={this.props.isAuth}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          // кнопка Cancel в модальном
          purchaseCancelled={this.purchaseCancelHandler}
          // кнопка Continue в модальном
          purchaseContinued={this.purchaseContinueHadler}
          price={this.props.price}
        />
      );
    }

    return (
      <Aux>
        <Modal
          // отображение модального окна
          show={this.state.purchasing}
          // фон при активном модальном окне
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice.toFixed(2),
    error: state.burgerBuilder.error,
    isAuth: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdd: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemove: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
