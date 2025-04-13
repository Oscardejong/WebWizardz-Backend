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
}

export default CustomerCatalog;
