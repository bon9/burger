export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = false;
  if (!rules) return true; // если правила нет, то вернуть true
  // если updateFormElement.validation.required = true
  // то проверяем не пустое ли поле, не считая пробелы (trim)
  if (rules.required) {
    isValid = value.trim() !== ""; //если не пустое - вернёт true
  }

  // если такие правила сущестуют
  if (rules.minLength) {
    isValid = rules.minLength < value.length;
  }
  if (rules.maxLength) {
    isValid = rules.maxLength > value.length;
  }

  return isValid;
};
