
document.getElementById('cancel_transaction').onclick = function DeactivateModal(){
    document.querySelector('.modal_overlay').classList.remove('active');
}

document.getElementById('new_transaction_button').onclick = function ActivateModal(){
    document.querySelector('.modal_overlay').classList.add('active');
}

const transactions = [
    {
        description: 'Agua',
        amount: 2000,
        date: '20/20/20'
    },
    {
        description: 'Luz',
        amount: -1900,
        date: '20/20/20'
    },
    {
        description: 'Sal',
        amount: 0,
        date: '20/20/20'
    },
]

const DOM = {
    transactionsContainer: document.querySelector('.table_body'),

    AddTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.classList.add('transaction');
        tr.innerHTML = this.InnerHTMLTransaction(transaction);

        this.transactionsContainer.appendChild(tr);

        this.UpdateBalance();
    },

    ClearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    },

    InnerHTMLTransaction(transaction){
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
        <img src="assets/images/delete_transaction.svg" alt="Deletar transacao" class="delete_transaction_icon">
    </td>
    `;
        return html;
    },

    UpdateBalance(){
        document.querySelector('.card_income .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateIncomes());
        document.querySelector('.card_expense .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateExpenses());
        document.querySelector('.card_total .card_value').innerHTML = Utils.FormatCurrencyWithSignal(Transaction.CalculateTotal());
    },

    
}

const Transaction = {
    all: transactions,

    Add(transaction){
        this.all.push(transaction);
        App.Reload();
    },

    Remove(index){
        Transaction.all.splice(index, 1);
        App.Reload();
    },

    CalculateIncomes(){
        let incomes = 0;

        transactions.forEach(function(transaction){
            if(transaction.amount >= 0){
                incomes += Number(transaction.amount);
            }
        })
        return incomes;
    },

    CalculateExpenses(){
        let expenses = 0;

        transactions.forEach(function(transaction){
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
    }
}
const App = {
    Init(){
        Transaction.all.forEach(function(transaction){
            DOM.AddTransaction(transaction);
        })
    },

    Reload(){
        DOM.ClearTransactions();
        this.Init();
    }
}

App.Init();
