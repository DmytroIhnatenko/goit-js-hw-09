import JustValidate from 'just-validate';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let LOCAL_VALUES = 'feedback-form-state';

let formData = getStorageData();

updateText();

const currentForm = document.querySelector('.feedback-form');

currentForm.addEventListener('input', e => {
  if (e.target.name !== 'email' && e.target.name !== 'message') {
    return;
  }

  updateLocalStorage(prepareData(e.target.name, e.target.value));
});

function prepareData(key, inputData) {
  formData[key] = inputData.trim();
  return JSON.stringify(formData);
}

function updateLocalStorage(dataUpdate) {
  localStorage.setItem(LOCAL_VALUES, dataUpdate);
}

function getStorageData() {
  return (
    JSON.parse(localStorage.getItem(LOCAL_VALUES)) || { email: '', message: '' }
  );
}

function updateText() {
  formData = getStorageData();
  for (const key in formData) {
    const keyValue = formData[key];
    const field = document.querySelector(`[name="${key}"]`);
    if (field) {
      field.value = keyValue;
    }
  }
}

const validator = new JustValidate('.feedback-form');

validator
  .addField('[name="email"]', [
    {
      rule: 'required',
      errorMessage: "Поле email - обов'язкове",
    },
    {
      rule: 'email',
      errorMessage: 'Не правильний формат. Перевірте ще раз.',
    },
  ])
  .addField('[name="message"]', [
    {
      validator: value => {
        return value !== undefined && String(value).trim().length > 3;
      },
      errorMessage: 'Повідомлення повинне бути не менше 3 символів.',
    },
  ])
  .onSuccess(() => {
    console.log('success', formData);
    localStorage.removeItem(LOCAL_VALUES);
    formData = getStorageData();
    currentForm.reset();
  });

currentForm.addEventListener('submit', e => {
  e.preventDefault();

  if (!formData.email || !formData.message) {
    iziToast.error({
      title: 'Error',
      message: 'Fill please all fields',
    });
    return;
  }

  console.log(formData);

  localStorage.removeItem(LOCAL_VALUES);
  currentForm.reset();
  formData = { email: '', message: '' };
});
