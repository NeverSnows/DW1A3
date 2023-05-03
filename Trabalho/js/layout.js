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
    DeactivateModal(){
        document.querySelector('.modal_overlay').classList.remove('active');
        document.querySelector('.modal_overlay').classList.add('inactive')
        Form.DeactivateAllForcedFields();
    },

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

    ClearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    },

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

    UpdateBalance(){
        const transactionTotal = Transaction.CalculateTotal();

        document.querySelector('.card_income .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateIncomes());
        document.querySelector('.card_expense .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateExpenses());
        document.querySelector('.card_total .card_value').innerHTML = Utils.FormatCurrencyWithSignal(transactionTotal);

        if(transactionTotal > 0){
            document.querySelector('.card_total').classList.remove('card_total_negative');
            document.querySelector('.card_total').classList.remove('card_total_neutral');
            document.querySelector('.card_total').classList.add('card_total_positive');
        }else if(transactionTotal < 0){
            document.querySelector('.card_total').classList.remove('card_total_positive');
            document.querySelector('.card_total').classList.remove('card_total_neutral');
            document.querySelector('.card_total').classList.add('card_total_negative');
        }else{
            document.querySelector('.card_total').classList.remove('card_total_positive');
            document.querySelector('.card_total').classList.remove('card_total_negative');
            document.querySelector('.card_total').classList.add('card_total_neutral');
        }
    
    },

    ActivateQuestionDelete(index){
        this.DeactivateQuestionDelete(this.lastActiveQuestionDelete);
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.remove('inactive');
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.add('active');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.remove('active');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.add('inactive');
        this.lastActiveQuestionDelete = index;
    },

    DeactivateQuestionDelete(index){
        if(document.querySelector('.transaction[data-index="' + index + '"]') != null){
            document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.remove('active');
            document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.add('inactive');
            document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.remove('inactive');
            document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.add('active');
        }
    },

    SwapWebpagetheme(){
        if(Storage.get("theme") == 'light' || Storage.get("theme") == ''){
            document.getElementById('theme').setAttribute('href', 'style/darkColors.css');
            document.getElementById('change_theme').classList.add('dark_theme');
            document.getElementById('change_theme').classList.remove('light_theme');
            Storage.set('dark', "theme");
        }else if(Storage.get("theme") == 'dark' ){
            document.getElementById('theme').setAttribute('href', 'style/lightColors.css');
            document.getElementById('change_theme').classList.add('light_theme');
            document.getElementById('change_theme').classList.remove('dark_theme');
            Storage.set('light', "theme");
        }
    },

    CheckWebpagetheme(){
        if(Storage.get("theme") == 'light'){
            document.getElementById('theme').setAttribute('href', 'style/lightColors.css');
            document.getElementById('change_theme').classList.add('light_theme');
            document.getElementById('change_theme').classList.remove('dark_theme');
        }else if(Storage.get("theme") == 'dark'){
            document.getElementById('theme').setAttribute('href', 'style/darkColors.css');
            document.getElementById('change_theme').classList.add('dark_theme');
            document.getElementById('change_theme').classList.remove('light_theme');
        }
    }
    
}

const Storage = {
    get(key){
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    set(value, key){
        localStorage.setItem(key, JSON.stringify(value));
    }
}

const Transaction = {
    transactionsList: Storage.get("transactions"),

    //transactionsList: testTransactions, //TODO remove upon release

    Add(transaction){
        this.transactionsList.push(transaction);
        App.Reload();
    },

    Remove(index){
        this.transactionsList.splice(index, 1);
        App.Reload();
    },

    CalculateIncomes(){
        let incomes = 0;

        this.transactionsList.forEach(function(transaction){
            if(transaction.amount >= 0){
                incomes += Number(transaction.amount);
            }
        })
        return incomes;
    },

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
    FormatCurrency(value){
        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR",{style: "currency", currency: "BRL"})
        return value;
    },

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

    FormatAmount(value){
        let expense = (value * 100).toFixed(2);
        
        expense = expense.toString().replace('-', '');
        
        if(Modal.expenseType == 'income'){
            return Number(expense);
        }else{
            return Number('-' + expense);
        }
        
    },

    FormatDate(value){
        //1999-12-31
        const splicedDate = value.split("-");
        //31/12/1999
        return `${splicedDate[2]}/${splicedDate[1]}/${splicedDate[0]}`;
    },
}

const App = {
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

    Reload(){
        DOM.ClearTransactions();
        this.Init();
    }
}

const Form = {
    description: document.getElementById('transaction_description'),
    amount: document.getElementById('transaction_amount'),
    date: document.getElementById('transaction_date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
            //{description: 'AAAAAAAAA', amount: '11111111', date: '2002-09-01'}
        }
    },

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

    ValidateFields(){
        const{description, amount, date} = this.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    ClearFields(){
        this.description.value = "";
        this.amount.value = "";
        this.date.value = "";
    },

    SubmitNewTransaction(event){
        try{  
            event.preventDefault();
            this.ValidateFields();
            const transaction = this.FormatValues();
            this.SaveTransaction(transaction);
            this.ClearFields();
            Modal.DeactivateModal();
        }catch(error){
            this.ActivateForcedFields();
        }
    },

    SaveTransaction(transaction){
        Transaction.Add(transaction);
    },

    DeactivateAllForcedFields(){ 
        document.getElementById('description_forced_field').classList.remove('active');
        document.getElementById('amount_forced_field').classList.remove('active');
        document.getElementById('date_forced_field').classList.remove('active');
        document.getElementById('description_forced_field').classList.add('inactive');
        document.getElementById('amount_forced_field').classList.add('inactive');
        document.getElementById('date_forced_field').classList.add('inactive');
    },

    ActivateForcedFields(){
        const{description, amount, date} = this.getValues();
            
        if(description.trim() === "" ){
            document.getElementById('description_forced_field').classList.add('active');
            document.getElementById('description_forced_field').classList.remove('inactive');
        }else{
            document.getElementById('description_forced_field').classList.remove('active');
            document.getElementById('description_forced_field').classList.add('inactive');
        }

        if(amount.trim() === ""){
            document.getElementById('amount_forced_field').classList.add('active');
            document.getElementById('amount_forced_field').classList.remove('inactive');

        }else{
            document.getElementById('amount_forced_field').classList.remove('active');
            document.getElementById('amount_forced_field').classList.add('inactive');
        }

        if(date.trim() === ""){
            document.getElementById('date_forced_field').classList.add('active');
            document.getElementById('date_forced_field').classList.remove('inactive');
        }else{
            document.getElementById('date_forced_field').classList.remove('active');
            document.getElementById('date_forced_field').classList.add('inactive');
        }
    }
}

const EventListeners = {
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
