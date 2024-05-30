#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

// Bank Account interface
interface BankAccount {
    accountNumber: number;
    balance: number;
    withdraw(amount: number): void;
    deposit(amount: number): void;
    checkBalance(): void;
}

// Creating BankAccount class
class BankAccount implements BankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // Debit Money
    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(chalk.red(`You have withdrawn $${amount} successfully! Your remaining balance is $${this.balance}`));
        } else {
            console.log(chalk.red("You have insufficient balance"));
        }
    }

    // Credit Money
    deposit(amount: number): void {
        if (amount > 100) {
            // $1 fee charged if more than $100 is deposited
            amount -= 1;
        }
        this.balance += amount;
        console.log(chalk.green(`You have deposited $${amount} successfully! Your new balance is $${this.balance}`));
    }

    // Check Balance
    checkBalance(): void {
        console.log(chalk.blue(`Your current balance is $${this.balance}`));
    }
}

// Create customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: string;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: string, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Function to interact with the user and create bank accounts and customers
async function createCustomer(): Promise<Customer> {
    const accountQuestions = [
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter account number:',
            validate: (input: any) => isNaN(input) ? 'Account number must be a number' : true
        },
        {
            type: 'input',
            name: 'balance',
            message: 'Enter initial balance:',
            validate: (input: any) => isNaN(input) ? 'Balance must be a number' : true
        }
    ];

    const customerQuestions = [
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter first name:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter last name:'
        },
        {
            type: 'list',
            name: 'gender',
            message: 'Select gender:',
            choices: ['Male', 'Female', 'Other']
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter age:',
            validate: (input: any) => isNaN(input) ? 'Age must be a number' : true
        },
        {
            type: 'input',
            name: 'mobileNumber',
            message: 'Enter mobile number:'
        }
    ];

    const accountAnswers = await inquirer.prompt(accountQuestions);
    const customerAnswers = await inquirer.prompt(customerQuestions);

    const newAccount = new BankAccount(Number(accountAnswers.accountNumber), Number(accountAnswers.balance));
    const newCustomer = new Customer(customerAnswers.firstName, customerAnswers.lastName, customerAnswers.gender, Number(customerAnswers.age), customerAnswers.mobileNumber, newAccount);

    return newCustomer;
}

// Function to handle banking operations
async function handleBanking(customer: Customer) {
    const bankingQuestions = [
        {
            type: 'list',
            name: 'operation',
            message: 'What would you like to do?',
            choices: ['Deposit', 'Withdraw', 'Check Balance', 'Exit']
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount:',
            when: (answers: any) => answers.operation !== 'Check Balance' && answers.operation !== 'Exit',
            validate: (input: any) => isNaN(input) ? 'Amount must be a number' : true
        }
    ];

    let continueBanking = true;

    while (continueBanking) {
        const answers = await inquirer.prompt(bankingQuestions);

        switch (answers.operation) {
            case 'Deposit':
                customer.account.deposit(Number(answers.amount));
                break;
            case 'Withdraw':
                customer.account.withdraw(Number(answers.amount));
                break;
            case 'Check Balance':
                customer.account.checkBalance();
                break;
            case 'Exit':
                continueBanking = false;
                console.log(chalk.yellow('Thank you for using our banking system!'));
                break;
        }
    }
}

// Main function to run the application
async function main() {
    console.log(chalk.yellow("Welcome to the Bank Account Management System"));
    const customer = await createCustomer();
    console.log(chalk.green("Customer created successfully!"));
    console.log(customer);

    await handleBanking(customer);
}

main();
