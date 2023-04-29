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

    ActivateModal(){
        document.querySelector('.modal_overlay').classList.add('active');
        document.querySelector('.modal_overlay').classList.remove('inactive')
    }
}

const DOM = {
    transactionsContainer: document.querySelector('.table_body'),
    lastActiveQuestionDelete : 0,

    AddTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.classList.add('transaction');
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
            <img src="assets/images/confirm.svg" alt="Confirm delete transaction" class="confirm_delete_transaction" onclick="Transaction.Remove(${index})">
            <img src="assets/images/deny.svg" alt="Deny delete transaction" class="deny_delete_transaction" onclick="DOM.DeactivateQuestionDelete(${index})">
        </div>
        <img src="assets/images/delete_transaction.svg" alt="Deletar transacao" class="delete_transaction_icon" id="delete_transaction" onclick="DOM.ActivateQuestionDelete(${index})"> 
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
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.remove('active');
        document.querySelector('.transaction[data-index="' + index + '"] .question_delete_transaction').classList.add('inactive');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.remove('inactive');
        document.querySelector('.transaction[data-index="' + index + '"] .delete_transaction_icon').classList.add('active');
    },

    
}

const Transaction = {
    transactionsList: [],

    transactionsList: testTransactions, //TODO remove upon release

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
        return Number(value) * 100;
    },

    FormatDate(value){
        //1999-12-31
        const splicedDate = value.split("-");
        //31/12/1999
        return `${splicedDate[2]}/${splicedDate[1]}/${splicedDate[0]}`;
    }
}

const Storage = {
    getTransaction(){
    },

    setTransaction(transactions){
        
    }
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
            document.getElementById('date_forced_forced_field').classList.remove('inactive');
        }else{
            document.getElementById('date_forced_field').classList.remove('active');
            document.getElementById('date_forced_forced_field').classList.add('inactive');
        }
    }
}

App.Init();

document.getElementById('cancel_transaction').onclick = function OnDeactivateModal(){
    Modal.DeactivateModal();
}

document.getElementById('new_transaction_button').onclick = function OnActivateModal(){
    Modal.ActivateModal();
}

document.getElementById('new_transaction_form').onsubmit = function OnSubmitNewTransaction(event){
    Form.SubmitNewTransaction(event);
}
