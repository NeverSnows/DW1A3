let firstNumber = '';
let secondNumber = '';
let operator = 'none';
let activeNumer = 1;
let result;
let lastPress = 'initial';
const displayRefference = document.getElementById('display');

function AppendNumber(num){
    if(activeNumer == 1){
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
    }else if(lastPress == 'initial'){
        firstNumber = '0';
    }
    activeNumer = 2;
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
        case '+': result = Add(firstNumber, secondNumber);
    }
    console.log('Result: ' + result);
}

function Equals(){
    GetResult();
    activeNumer = 1;
    operator = 'none';
    firstNumber = '';
    secondNumber = '';
    displayRefference.innerHTML = '';
    displayRefference.append(result);
    lastPress = 'equals';
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
    // if(num2 == 0){
    //     return 'error';
    // }

    return num1 / num2;
}

/*
Every number/dot you click, will append a string. 
When you click an operator,it will parse that string
into a number and set the current operation.
When you hit '=', it will parse the second string to a number
and make the calculation based on both numbers and the operator.
*/