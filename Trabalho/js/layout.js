const testTransactions = [
    {
        description: 'Agua',
        amount: 2000,
        date: '07/09/1500'
    },
    {
        description: 'Luz',
        amount: -1900,
        date: '11/09/2002'
    },
    {
        description: 'Sal',
        amount: 0,
        date: '01/07/2050'
    },
];

const Modal = {
    //Handles deactivation of Form modal overlay.
    DeactivateModal(){
        document.querySelector('.modal_overlay').classList.remove('active');
        document.querySelector('.modal_overlay').classList.add('inactive')
        Form.DeactivateAllForcedFields();
    },

    //Handles activation of Form modal overlay.
    ActivateModal(type){
        Form.DeactivateAllForcedFields();
        if(type == 'income'){
            document.querySelector('.new_transaction_title').innerHTML = 'Nova Entrada';
        }else{
            document.querySelector('.new_transaction_title').innerHTML = 'Nova Saida';
        }

        document.querySelector('.modal_overlay').classList.add('active');
        document.querySelector('.modal_overlay').classList.remove('inactive')

        this.expenseType = type;
    }
}

const DOM = {
    transactionsContainer: document.querySelector('.table_body'),
    lastActiveQuestionDelete: 0,
    theme: document.getElementById('theme'),
    changeTheme: document.getElementById('change_theme'),

    //Creates a table row - tr - and adds its internal data based on the received transaction and index.
    AddTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.classList.add('transaction');
        if((index % 2) == 1){
            tr.classList.add('odd_row');
        }

        tr.innerHTML = this.InnerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        this.transactionsContainer.appendChild(tr);

        this.UpdateBalance();
    },

    //Removes all trasnactions from HTML transactions table.
    ClearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    },

    //Represents the insinde data of a row from the transactions table.
    InnerHTMLTransaction(transaction, index){
        let transactionType;

        if(transaction.amount > 0){
            transactionType = 'income';
        } else if(transaction.amount < 0){
            transactionType = 'expense';
        }else{
            transactionType = 'neutral';
        }

        const html = 
    `
    <td class="transaction_description">${transaction.description}</td>
    <td class="transaction_${transactionType}">${Utils.FormatCurrencyWithSignal(transaction.amount)}</td>
    <td class="transaction_date">${transaction.date}</td>
    <td class="delete_transaction_container">
        <div class="question_delete_transaction inactive">
            <img src="assets/images/confirm.svg" alt="Confirm delete transaction" class="confirm_delete_transaction">
            <img src="assets/images/deny.svg" alt="Deny delete transaction" class="deny_delete_transaction">
        </div>
        <img src="assets/images/delete_transaction.svg" alt="Deletar transacao" class="delete_transaction_icon" id="delete_transaction"> 
    </td>  
    `;
        return html;
    },

    //Calculates and sets  income, expense and total on balance cards.
    UpdateBalance(){
        const transactionTotal = Transaction.CalculateTotal();
        const cardTotal = document.querySelector('.card_total');

        document.querySelector('.card_income .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateIncomes());
        document.querySelector('.card_expense .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateExpenses());
        document.querySelector('.card_total .card_value').innerHTML = Utils.FormatCurrencyWithSignal(transactionTotal);


        //Sets appropriate color to total balance
        if(transactionTotal > 0){
            cardTotal.classList.remove('card_total_negative');
            cardTotal.classList.remove('card_total_neutral');
            cardTotal.classList.add('card_total_positive');
        }else if(transactionTotal < 0){
            cardTotal.classList.remove('card_total_positive');
            cardTotal.classList.remove('card_total_neutral');
            cardTotal.classList.add('card_total_negative');
        }else{
            cardTotal.classList.remove('card_total_positive');
            cardTotal.classList.remove('card_total_negative');
            cardTotal.classList.add('card_total_neutral');
        }
    
    },

    //Activates delete confirmation buttons on a row defined by "index". 
    //Prevents two confirmation forms to be active at the same time
    ActivateQuestionDelete(index){
        this.DeactivateQuestionDelete(this.lastActiveQuestionDelete);//Deactivates previously pressed active confirmation buttons
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.remove('inactive');
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.add('active');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.remove('active');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.add('inactive');
        this.lastActiveQuestionDelete = index;
    },

    //Deactivates both confirmation buttons generated when deleting a transaction under a row defined by "index".
    DeactivateQuestionDelete(index){
        if(document.querySelector('.transaction[data-index="' + index + '"]') != null){
            document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.remove('active');
            document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.add('inactive');
            document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.remove('inactive');
            document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.add('active');
        }
    },

    //Checks current theme prefference on sotrage and swaps it.
    SwapWebpagetheme(){
        if(Storage.get("theme") == 'light' ){
            this.theme.setAttribute('href', 'style/darkColors.css');
            this.changeTheme.classList.add('dark_theme');
            this.changeTheme.classList.remove('light_theme');
            Storage.set('dark', "theme");
        }else{
            this.theme.setAttribute('href', 'style/lightColors.css');
            this.changeTheme.classList.add('light_theme');
            this.changeTheme.classList.remove('dark_theme');
            Storage.set('light', "theme");
        }
    },

    //Checks current theme prefference from storage, and then sets appropriate theme. Should be called on start.
    CheckWebpagetheme(){
        if(Storage.get("theme") == 'light' ){
            this.theme.setAttribute('href', 'style/lightColors.css');
            this.changeTheme.classList.add('light_theme');
            this.changeTheme.classList.remove('dark_theme');
        }else{
            this.theme.setAttribute('href', 'style/darkColors.css');
            this.changeTheme.classList.add('dark_theme');
            this.changeTheme.classList.remove('light_theme');
        }
    }
    
}

const Storage = {
    //Get a value - such as an array or a string - from the storage, under the name of a 
    //key - string must be an existing register on local storage, or it will return an empty array instead.
    get(key){
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    //Set a value - such as an array or a string - to the storage, under the name of a key - must be a string.
    set(value, key){
        localStorage.setItem(key, JSON.stringify(value));
    }
}

const Transaction = {
    transactionsList: Storage.get("transactions"),

    //transactionsList: testTransactions,

    //Adds a transaction from the transactions list and updates webpage.
    Add(transaction){
        this.transactionsList.push(transaction);
        App.Reload();
    },

    //Removes a transaction from the transactions list and updates webpage.
    Remove(index){
        this.transactionsList.splice(index, 1);
        App.Reload();
    },

    //Adds all incomes and returns its value.
    CalculateIncomes(){
        let incomes = 0;

        this.transactionsList.forEach(function(transaction){
            if(transaction.amount >= 0){
                incomes += Number(transaction.amount);
            }
        })
        return incomes;
    },

    //Adds all expenses and returns its value.
    CalculateExpenses(){
        let expenses = 0;

        this.transactionsList.forEach(function(transaction){
            if(transaction.amount < 0){
                expenses += Number(transaction.amount);
            }
        })
        return expenses;
    },

    CalculateTotal(){
        return this.CalculateIncomes() + this.CalculateExpenses();
    }
}

const Utils = {
    //Formats currency absolute value to pt-BR format;
    FormatCurrency(value){
        value = String(value).replace(/\D/g, "");//Removes all non digits.
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR",{style: "currency", currency: "BRL"})
        return value;
    },

    //Returns the amount, formated to pt-BR currency and with its correct a signal.
    FormatCurrencyWithSignal(value){
        let signal;

        if(value > 0){
            signal = "+";
        } else if(value < 0){
            signal = "-";
        }else{
            signal = '&nbsp&nbsp';
        }

        return signal + this.FormatCurrency(value);
    },

    //Returns ammount with no decimal places and with its respective symbol.
    FormatAmount(value){
        let expense = (value * 100).toFixed(2); //toFixed() is used to prevent floating point math errors.
        
        expense = expense.toString().replace('-', '');
        
        if(Modal.expenseType == 'income'){
            return Number(expense);
        }else{
            return Number('-' + expense);
        }
    },

    //Returns date on a more user friendly pt-BR format
    FormatDate(value){
        //Received format: 1999-12-31
        const splicedDate = value.split("-");
        //Output format: 31/12/1999
        return `${splicedDate[2]}/${splicedDate[1]}/${splicedDate[0]}`;
    },
}

const App = {
    //Gets transactions list and adds it to web page, subscribes event listeners and save transactions on storage.
    Init(){
        if(Transaction.transactionsList.length > 0){
            Transaction.transactionsList.forEach(function(transaction, index){
                DOM.AddTransaction(transaction, index);
            })
        }else{
            DOM.UpdateBalance();
        }
        EventListeners.SubscribeDynamicEventListeners();
        Storage.set(Transaction.transactionsList, "transactions");
    },

    //Called every time an action should change web page.
    Reload(){
        DOM.ClearTransactions();
        this.Init();
    }
}

const Form = {
    description: document.getElementById('transaction_description'),
    amount: document.getElementById('transaction_amount'),
    date: document.getElementById('transaction_date'),

    descriptionForcedField: document.getElementById('description_forced_field'),
    amountForcedField: document.getElementById('amount_forced_field'),
    dateForcedField: document.getElementById('date_forced_field'),

    //Returns all form fields values.
    getValues(){
        return{
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
            //{description: 'AAAAAAAAA', amount: '11111111', date: '2002-09-01'}
        }
    },

    //Gets form fields and format them.
    FormatValues(){
        let{description, amount, date} = this.getValues();
        amount = Utils.FormatAmount(amount);
        date = Utils.FormatDate(date);

        return{
            description,
            amount,
            date
        }
    },

    //Checks if any field is empty.
    ValidateFields(){
        const{description, amount, date} = this.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    //Resets state of form fields.
    ClearFields(){
        this.description.value = "";
        this.amount.value = "";
        this.date.value = "";
    },

    //Handles transaction submission.
    SubmitNewTransaction(event){
        try{  
            event.preventDefault();
            this.ValidateFields();
            const transaction = this.FormatValues();
            Transaction.Add(transaction);
            this.ClearFields();
            Modal.DeactivateModal();
        }catch(error){
            this.ActivateForcedFields();
        }
    },

    //Sets all "*Obligatory fields" inactive. Used to reset form initial state.
    DeactivateAllForcedFields(){ 
        this.descriptionForcedField.classList.remove('active');
        this.descriptionForcedField.classList.add('inactive');
        this.amountForcedField.classList.remove('active');
        this.amountForcedField.classList.add('inactive');
        this.dateForcedField.classList.remove('active');
        this.dateForcedField.classList.add('inactive');
    },

    //Sets  the "*Obligatory field" on forms active or inactive.
    ActivateForcedFields(){
        const{description, amount, date} = this.getValues();

        if(description.trim() === "" ){
            this.descriptionForcedField.classList.add('active');
            this.descriptionForcedField.classList.remove('inactive');
        }else{
            this.descriptionForcedField.classList.remove('active');
            this.descriptionForcedField.classList.add('inactive');
        }

        if(amount.trim() === ""){
            this.amountForcedField.classList.add('active');
            this.amountForcedField.classList.remove('inactive');
        }else{
            this.amountForcedField.classList.remove('active');
            this.amountForcedField.classList.add('inactive');
        }

        if(date.trim() === ""){
            this.dateForcedField.classList.add('active');
            this.dateForcedField.classList.remove('inactive');
        }else{
            this.dateForcedField.classList.remove('active');
            this.dateForcedField.classList.add('inactive');
        }
    }
}

const EventListeners = {
    //Subscribes event lsiteners to components that wont change over time. 
    //Should be called once at the start.
    SubscribeEventListeners(){

        document.getElementById('cancel_transaction').addEventListener('click', function() {
            Modal.DeactivateModal();
          });

        document.getElementById('save_transaction').addEventListener('click', function(event) {
            Form.SubmitNewTransaction(event);
        })
        
        document.querySelector(".new_income").addEventListener('click', function() {
            Modal.ActivateModal('income');
        });

        document.querySelector(".new_expense").addEventListener('click', function() {
            Modal.ActivateModal('expense');
        });

        document.getElementById('change_theme').addEventListener('click', function() {
            DOM.SwapWebpagetheme();
        });
    },

    //Subscribes event listeners to components that will change over time, such as table rows.
    SubscribeDynamicEventListeners(){
        const transactionsElements = document.querySelectorAll('.transaction');

        transactionsElements.forEach(transaction => {
            deleteButton = transaction.querySelector('.delete_transaction_icon');
            denyDeleteButton = transaction.querySelector('.deny_delete_transaction');
            confirmDeleteButton = transaction.querySelector('.confirm_delete_transaction');

            const index = transaction.dataset.index;

            deleteButton.addEventListener('click', function() {
                DOM.ActivateQuestionDelete(index);
            });
            denyDeleteButton.addEventListener('click', function(){
                DOM.DeactivateQuestionDelete(index);
            });
            confirmDeleteButton.addEventListener('click', function(){
                Transaction.Remove(index);
            });
        });
    }
}

App.Init();
EventListeners.SubscribeEventListeners();
DOM.CheckWebpagetheme();
