let firstNumber = '';
let secondNumber = '';
let operator = 'none';
let result;

let currentOperand = 1;
let lastPress = 'initialState';

const displayElement = document.getElementById('display');

function AppendNumber(num){
    if(currentOperand == 1){
        if(firstNumber == ''){
            displayElement.innerHTML = '';
        }
        firstNumber += num;
        console.log('First: ' + firstNumber);
    }else{
        secondNumber += num;
        console.log('Second: ' + secondNumber);
    }
    lastPress = 'number';
    displayElement.append(num);
}

function OperatorHandler(op){
    if(lastPress == 'operator'){
        displayElement.innerHTML = firstNumber;
    }else if(lastPress == 'equals'){
        firstNumber = result;
    }else if(operator != 'none'){
        OperatorEquals();
    }else if(lastPress == 'initialState' || lastPress == 'clear'){
        firstNumber = '0';
    }
    currentOperand = 2;
    operator = op;
    displayElement.append(operator);
    console.log('Operator: ' + operator);
    lastPress = 'operator';
}

function OperatorEquals(){
   GetResult();
   displayElement.innerHTML = result;
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
    result = '';
    GetResult();
    if(result == ''){
        result = 0;
    }
    Clear();
    displayElement.innerHTML = result;
    lastPress = 'equals';
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
    displayElement.innerHTML = displayElement.innerHTML.substring(0, displayElement.innerHTML.length - 1);
}

function Clear(){
    firstNumber = '';
    secondNumber = '';
    operator = 'none';
    currentOperand = 1;
    displayElement.innerHTML = '0';
    lastPress = 'clear';
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
