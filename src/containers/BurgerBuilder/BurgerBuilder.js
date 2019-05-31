import React, { useState, useEffect } from "react";
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

export const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false); // отображение orderSummary

  useEffect(() => {
    props.onInitIngredients();
  }, []);

  const updatePurchaseState = ingredients => {
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

  const purchaseHandler = () => {
    if (props.isAuth) {
      setPurchasing(true);
    } else {
      // если auth = false устанавливаем authRedirectPath в state на /checkout
      // чтобы после регистрации нас вернуло сразу на чекаут
      // и перекидываем на стр auth
      props.onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHadler = () => {
    props.onInitPurchase();
    props.history.push("/checkout");
  };

  const disabledInfo = {
    // props.ings получаем с connect
    ...props.ings // копируем текущее сост
  };
  // присвоим каждому ключу (ингредиенту) true/false
  // {salad: true, meat: false, ...}
  for (let key in disabledInfo) {
    // disabledInfo[key] = true если disabledInfo[key] <= 0
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
  // как только ингридиенты считываются с базы в стейт, то выводи ...
  if (props.ings) {
    burger = (
      <Aux>
        <Burger ingredients={props.ings} />
        <BuildControls
          //аргумент для ingName передается в самом BuildControls
          ingredientAdded={props.onIngredientAdd}
          ingredientRemoved={props.onIngredientRemove}
          disabled={disabledInfo} // Less button on/off
          price={props.price}
          purchaseble={updatePurchaseState(props.ings)} // Order button active on/off
          ordered={purchaseHandler} // Order button click
          isAuth={props.isAuth}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        ingredients={props.ings}
        // кнопка Cancel в модальном
        purchaseCancelled={purchaseCancelHandler}
        // кнопка Continue в модальном
        purchaseContinued={purchaseContinueHadler}
        price={props.price}
      />
    );
  }

  return (
    <React.Fragment>
      <Modal
        // отображение модального окна
        show={purchasing}
        // фон при активном модальном окне
        modalClosed={purchaseCancelHandler}
      >
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  );
};

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
