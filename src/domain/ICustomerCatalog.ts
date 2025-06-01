// ICustomerCatalog.ts
import Customer from "./Customer";
import Result from "./Result";

/**
 * Interface voor het beheren van klanten in een catalogus.
 * Zorgt voor loskoppeling tussen implementatie en gebruik,
 * zodat je eenvoudig mocks of stubs kunt gebruiken in tests.
 */
export default interface ICustomerCatalog {
  /** Retourneert een readonly lijst van klanten. */
  getCustomers(): ReadonlyArray<Customer>;

  /** Zoekt een klant op basis van e-mail. */
  getCustomerByEmail(email: string): Customer | undefined;

  /** Voegt een klant toe aan de catalogus. */
  addCustomer(customer: Customer): Result;

  /** Verwijdert alle klanten. */
  clear(): void;

  /** Verwijdert een klant op basis van e-mail. */
  deleteCustomerByEmail(email: string): void;

  /** Vervangt een bestaande klant met dezelfde e-mail. */
  updateCustomer(customer: Customer): void;
}
