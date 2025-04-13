import Customer from "../models/Model-Customer"; 

class CustomerRepository {

    async insertCustomer(customerData: Partial<Customer>): Promise<Customer> {
        try {
            const customer = await Customer.create(customerData as any);
            console.log("Customer inserted:", customer.toJSON());
            return customer;
        } catch (error) {
            console.error("Error inserting customer:", error);
            throw error;
        }
    }

    async getAllCustomers(): Promise<Customer[]> {
        return await Customer.findAll();
    }

    async getCustomerByEmail(email: string): Promise<Customer | null> {
        return await Customer.findOne({
            where: {
                email: email
            }
        });
    }
}

export default CustomerRepository;
