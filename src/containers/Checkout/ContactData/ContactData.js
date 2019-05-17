import React, { Component } from "react";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";

class ContactData extends Component {
  state = {
    orderForm: {
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
          placeholder: "ZIP Code"
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
          required: false
        },
        valid: true
      }
    },
    formIsValid: false
  };

  // submit формы
  orderHandler = event => {
    // убираем стандартное поведение - отправление при нажатии кнопки
    event.preventDefault();
    // копируем в formData value полей
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    // отправляемый заказ
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    };

    this.props.onOrderBurger(order, this.props.token);
  };

  // проверка поля на валидность
  checkValidity(value, rules) {
    let isValid = false;
    if (!rules) return true; // если правила нет, то вернуть true
    // если updateFormElement.validation.required = true
    // то проверяем не пустое ли поле, не считая пробелы (trim)
    if (rules.required) {
      isValid = value.trim() !== ""; //если не пустое - вернёт true
    }

    // если такие правила сущестуют
    if (rules.minLength && rules.maxLength) {
      isValid =
        rules.minLength >= value.length && rules.maxLength <= value.length;
    }
    return isValid;
  }

  // срабатывает при вводе каждого символа в input
  // inputIdentifier = name, street, mail..
  inputChangedHandler = (event, inputIdentifier) => {
    const updateOrderForm = {
      ...this.state.orderForm // updateOrderForm = orderForm
    };
    const updateFormElement = {
      ...updateOrderForm[inputIdentifier] // updateFormElement = updateOrderForm[name]
    };
    updateFormElement.value = event.target.value; // name: {value = ..}
    // name.valid = checkValidity(значение инпута, validation(правило которое указанно в стейте элемента)
    // valid установится в true/false
    if (updateFormElement.validation.required) {
      // проверка на требуемость проверки
      updateFormElement.valid = this.checkValidity(
        updateFormElement.value,
        updateFormElement.validation
      );
    }
    updateFormElement.touched = true; // касание в поле
    updateOrderForm[inputIdentifier] = updateFormElement; // обновляем name

    // заполнена ли форма
    let formIsValid = true;
    for (let inputIdentifier in updateOrderForm) {
      formIsValid = updateOrderForm[inputIdentifier].valid && formIsValid;
    }
    console.log(formIsValid);
    this.setState({ orderForm: updateOrderForm, formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key, // name, street, email
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid} //!valid
            shouldValidate={formElement.config.validation} // false если у поля нету валидации
            touched={formElement.config.touched} // начинался ли ввод в поле
            changed={event => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          Order
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

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
