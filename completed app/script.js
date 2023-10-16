'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ahmed Nazem',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 6000],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//vid 147 (App)

const dispalymovement = function (movement, sort = false) {
  //set the sort into false so we can control it with the button
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // if sort is true then take a copy of the array and sort it assending else return the current movements
  movement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
 <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const calcDisplayBalance = function (acc) {
  acc.balance = movements.reduce((acc, cur) => acc + cur, 0); //calculating the whole array in the account 1 /creating new proprtie balance
  labelBalance.textContent = `${acc.balance}€`; //desplaying the result
};

//from155
const calcdisplaySummery = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`; //abs is for removing the negative - operator

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, intersts) => acc + intersts, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/////////////////from vid 151////////////////////////////////
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //creating a new proprtie  username and set it equaal to the current proprtie that we have in the object
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

/////////////////from vid 159///////////////////////////////
const updateUI = function (acc) {
  dispalymovement(acc.movements); //we need just the movements of the account so we dont want to decalre the entire acoount
  calcDisplayBalance(acc); //we used  the entire account  because we used diffrent proptires of the account same as below
  calcdisplaySummery(acc);
};
/////////////////from vid 158////////////////////////////////
let useraccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  useraccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(useraccount);
  if (useraccount && useraccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back, ${
      useraccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(useraccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value); //the number of currincy we want to transfer
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value //check if the input username   is exist in the array of account
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 && //if user but larger number than 0
    useraccount.balance >= amount && //if the user have money to transfer  grater or equal than his money
    reciverAcc?.username !== useraccount.username //if reciver account exist so ? and the user name of the account  is not the smae of his name of account so it would be transfer to him self
  ) {
    useraccount.movements.push(-amount); //show the status in negative from the sender
    reciverAcc.movements.push(amount); // show the status of the reciver
  }
});
btnClose.addEventListener('click', function (e) {
  //closing account case
  e.preventDefault();
  if (
    inputCloseUsername.value === useraccount.username && //if the user input of the name is equal to the name in accounts
    Number(inputClosePin.value) === useraccount.pin //and the pin is also equal
  ) {
    const index = accounts.findIndex(
      //boolean returns the index  if it was match the condition
      acc => acc.username === useraccount.username //the user name of the account is equal to the username of
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Number(inputLoanAmount.value);
  if (request > 0 && useraccount.movements.some(mov => mov >= request * 0.1)) {
    //add movment
    useraccount.movements.push(request);
    updateUI(useraccount);
  }
});
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  let sorted = false;
  dispalymovement(useraccount.movements, !sorted);
  sorted = !sorted; //toglling the sort value
});
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
