let firstNumber = '';
let secondNumber = '';
let operator = 'none';
let currentOperand = 1;
let result;
let lastPress = 'initialState';
const displayRefference = document.getElementById('display');

function AppendNumber(num){
    if(currentOperand == 1){
        if(firstNumber == ''){
            displayRefference.innerHTML = '';
        }
        firstNumber += num;
        console.log('First: ' + firstNumber);
    }else{
        secondNumber += num;
        console.log('Second: ' + secondNumber);
    }
    lastPress = 'number';
    displayRefference.append(num);
}

function OperatorHandler(op){
    if(lastPress == 'operator'){
        displayRefference.innerHTML = firstNumber;
    }else if(lastPress == 'equals'){
        firstNumber = result;
    }else if(operator != 'none'){
        OperatorEquals();
    }else if(lastPress == 'initialState' || lastPress == 'clear'){
        firstNumber = '0';
    }
    currentOperand = 2;
    operator = op;
    displayRefference.append(operator);
    console.log('Operator: ' + operator);
    lastPress = 'operator';
}

function OperatorEquals(){
   GetResult();
   displayRefference.innerHTML = result;
   firstNumber = toString(firstNumber);
   secondNumber = toString(secondNumber);
   firstNumber = result;
   secondNumber = '';
}

function GetResult(){
    firstNumber = parseFloat(firstNumber);
    secondNumber = parseFloat(secondNumber);

    switch(operator){
        case '/': result = Div(firstNumber, secondNumber); break;
        case '*': result = Prod(firstNumber, secondNumber); break;
        case '-': result = Diff(firstNumber, secondNumber); break;
        case '+': result = Add(firstNumber, secondNumber); break;
        case '%': result = Mod(firstNumber, secondNumber); break;
    }
    console.log('Result: ' + result);
}

function Equals(){
    GetResult();
    Clear();
    displayRefference.innerHTML = result;
    lastPress = 'equals';currentOperand
}

function Backspace(){

    if(lastPress == 'equals'){
        firstNumber = result.toString();
    }
    if(secondNumber != ''){
        DeleteEndOfDisplay();        
        secondNumber = secondNumber.substring(0, secondNumber.length - 1);
    }else if(operator != 'none'){
        DeleteEndOfDisplay();
        operator = 'none';
    }else if(firstNumber != ''){
        DeleteEndOfDisplay();
        firstNumber = firstNumber.substring(0, firstNumber.length - 1);
        if(firstNumber == ''){
            Clear();
        }
    }

    result = '';
    lastPress = 'backspace';

    console.log('N1: ' + firstNumber);
    console.log('Operator: ' + operator);
    console.log('N2: ' + secondNumber);
}

function DeleteEndOfDisplay(){
    displayRefference.innerHTML = displayRefference.innerHTML.substring(0, displayRefference.innerHTML.length - 1);
}

function Clear(){
    firstNumber = '';
    secondNumber = '';
    operator = 'none';
    currentOperand = 1;
    displayRefference.innerHTML = '0';
    lastPress = 'clear';
    result = '';
}

function Add(num1, num2){
    return num1 + num2;
}

function Diff(num1, num2){
    return num1 - num2;
}

function Prod(num1, num2){
    return num1 * num2;
}

function Div(num1, num2){
    return num1 / num2;
}

function Mod(num1, num2){
    return num1 % num2;
}
