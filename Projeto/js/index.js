//Don't ask how these methods work. 
function AppendNumber(num){
    if(currentOperand == 1){
        if(firstNumber == ''){
            displayElement.textContent = '';
        }
        firstNumber += num;
        //console.log('First: ' + firstNumber);
    }else{
        secondNumber += num;
        //console.log('Second: ' + secondNumber);
    }
    lastPress = 'number';
    displayElement.append(num);
}

function OperatorHandler(op){
    if(lastPress == 'operator'){
        displayElement.textContent = firstNumber;
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
    //console.log('Operator: ' + operator);
    lastPress = 'operator';
}

function OperatorEquals(){
   GetResult();
   displayElement.textContent = result;
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
        case 'none': break;
        default: console.error("Invalid operator");
    }
    //console.log('Result: ' + result);
}

function Equals(){
    result = '';
    GetResult();
    if(result == ''){
        result = 0;
    }
    Clear();
    displayElement.textContent = result;
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

    //console.log('backspace');
    //console.log('N1: ' + firstNumber);
    //console.log('Operator: ' + operator);
    //console.log('N2: ' + secondNumber);
}

function DeleteEndOfDisplay(){
    displayElement.textContent = displayElement.textContent.substring(0, displayElement.textContent.length - 1);
}

//Resets calculator to initial state.
function Clear(){
    firstNumber = '';
    secondNumber = '';
    operator = 'none';
    currentOperand = 1;
    displayElement.textContent = '0';
    lastPress = 'clear';
}

//These methods handle aritmetics and should filter out any invalid input.
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

//Checks keyboard inputs and calls functions accordingly.
function checkKeyPressed(event) {
    const key = event.key;

    if(!Number.isNaN(Number(key))){
        AppendNumber(key);
    } else{
        switch(key){
            case '+': OperatorHandler('+'); break;
            case '-': OperatorHandler('-'); break;
            case '*': OperatorHandler('*'); break;
            case '/': OperatorHandler('/'); break;
            case '%': OperatorHandler('%'); break;
            case '.': AppendNumber('.'); break;
            case ',': AppendNumber('.'); break;
            case '=': Equals(); break;
            case 'Enter': Equals(); break;
            case 'Backspace': Backspace(); break;
            case 'Delete': Clear(); break;
        }
    }
}

const EventListener = {
    //Should be called once at the start in order to avoid event listener duplicity.
    subscribeFixedEventListeners(){
        document.getElementById('zero-digit').addEventListener('click', ()=>{AppendNumber('0')});
        document.getElementById('one-digit').addEventListener('click', ()=>{AppendNumber('1')});
        document.getElementById('two-digit').addEventListener('click', ()=>{AppendNumber('2')});
        document.getElementById('three-digit').addEventListener('click', ()=>{AppendNumber('3')});
        document.getElementById('four-digit').addEventListener('click', ()=>{AppendNumber('4')});
        document.getElementById('five-digit').addEventListener('click', ()=>{AppendNumber('5')});
        document.getElementById('six-digit').addEventListener('click', ()=>{AppendNumber('6')});
        document.getElementById('seven-digit').addEventListener('click', ()=>{AppendNumber('7')});
        document.getElementById('eight-digit').addEventListener('click', ()=>{AppendNumber('8')});
        document.getElementById('nine-digit').addEventListener('click', ()=>{AppendNumber('9')});
        document.getElementById('dot-digit').addEventListener('click', ()=>{AppendNumber('.')});
        document.getElementById('clear-digit').addEventListener('click', Clear);
        document.getElementById('backspace-digit').addEventListener('click', Backspace);
        document.getElementById('mod-digit').addEventListener('click', ()=>{OperatorHandler('%')});
        document.getElementById('div-digit').addEventListener('click', ()=>{OperatorHandler('/')});
        document.getElementById('prod-digit').addEventListener('click', ()=>{OperatorHandler('*')});
        document.getElementById('dif-digit').addEventListener('click', ()=>{OperatorHandler('-')});
        document.getElementById('sum-digit').addEventListener('click', ()=>{OperatorHandler('+')});
        document.getElementById('equals-digit').addEventListener('click', Equals);
        window.addEventListener("keydown", checkKeyPressed, false);
    },

    //Should be called on every update.
    subscribeDynamicEventListeners(){

    },
};

//Atribuitions and calls should start here.

let firstNumber = '';
let secondNumber = '';
let operator = 'none';
let result;

let currentOperand = 1;
let lastPress = 'initialState';

const displayElement = document.getElementById('display');

EventListener.subscribeFixedEventListeners();