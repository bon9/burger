import React, { useState } from "react";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "./../../../shared/utility";

const ContactData = props => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your Name"
      },
      value: "",
      validation: {
        // валидация on/off
        required: true
      },
      valid: false, // проходит ли валидацию
      touched: false
    },

    street: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Street"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },

    zipCode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "ZIP Code (3 characters)"
      },
      value: "",
      validation: {
        required: true,
        minLength: 3,
        maxLength: 3
      },
      valid: false,
      touched: false
    },

    country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Country"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },

    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your E-Mail"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },

    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" }
        ]
      },
      value: "fastest",
      validation: {
        required: true
      },
      valid: true
    }
  });

  // submit формы
  const orderHandler = event => {
    // убираем стандартное поведение - отправление при нажатии кнопки
    event.preventDefault();
    // копируем в formData value полей
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }
    // отправляемый заказ
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
      userId: props.userId
    };

    props.onOrderBurger(order, props.token);
  };

  // срабатывает при вводе каждого символа в input
  // inputIdentifier = name, street, mail..
  const inputChangedHandler = (event, inputIdentifier) => {
    const updateFormElement = updateObject(orderForm[inputIdentifier], {
      value: event.target.value, // name: {value = ..}
      valid: checkValidity(
        event.target.value,
        orderForm[inputIdentifier].validation
      ),
      touched: true // касание в поле
    });

    const updateOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updateFormElement
    });

    // заполнена ли форма
    let formIsValid = true;
    for (let inputIdentifier in updateOrderForm) {
      formIsValid = updateOrderForm[inputIdentifier].valid && formIsValid;
    }
    setOrderForm(updateOrderForm);
    setFormIsValid(formIsValid);
  };

  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key, // name, street, email
      config: orderForm[key]
    });
  }

  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map(formElement => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid} //!valid
          shouldValidate={formElement.config.validation} // false если у поля нету валидации
          touched={formElement.config.touched} // начинался ли ввод в поле
          changed={event => inputChangedHandler(event, formElement.id)}
        />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>
        Order
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice.toFixed(2),
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
