import CustomerRepository from "../infrastructure/repositories/CustomerRepository";
import Result from "./Result";
import Customer from "./Customer";
import CustomerModel from "../infrastructure/models/Model-Customer";

class CustomerCatalog {
    private customers: Customer[] = []; 
    private repository: CustomerRepository;

    getCustomers(): readonly Customer[] {
        return this.customers;
    }

    getCustomerByEmail(email: string): Customer | undefined {
        return this.customers.find(customer => customer.getEmail() === email);
    }


    constructor() {
        this.repository = new CustomerRepository(); 
    }

    public addCustomer(customer: Customer): Result {
        this.customers.push(customer);


        return new Result(true, 'Account successfully saved');
    }

    clear(): void {
        this.customers = [];
      }

      deleteCustomerByEmail(email: string): void {
        this.customers = this.customers.filter(customer => customer.getEmail() !== email);
      }

      updateCustomer(customer: Customer): void {
        // Zoek naar de klant met dezelfde email en vervang deze
        const index = this.customers.findIndex(cust => cust.getEmail() === customer.getEmail());
        if (index !== -1) {
            this.customers[index] = customer; // Vervang de oude klant door de nieuwe klant
        }
    }

    

}

export default CustomerCatalog;
