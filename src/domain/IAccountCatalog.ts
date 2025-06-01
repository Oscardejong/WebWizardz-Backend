// IAccountCatalog.ts
import Account from "./Account";
import Result from "./Result";

/**
 * Abstractie voor een verzameling van accounts.
 * Laat toe om in productie de echte AccountCatalog te gebruiken
 * en in tests een lichte stub of mock te injecteren.
 */
export default interface IAccountCatalog {
  /** Retourneert alle accounts als read-only array. */
  getAccounts(): ReadonlyArray<Account>;

  /** Voegt een account toe en geeft het resultaat van de operatie terug. */
  addAccount(account: Account): Result;

  /** Vervangt een bestaand account met dezelfde gebruikersnaam. */
  updateAccount(account: Account): void;

  /** Verwijdert alle accounts uit het catalogus-geheugen. */
  clear(): void;

  /** Verwijdert het account met de gegeven gebruikersnaam (indien aanwezig). */
  deleteAccountByUsername(username: string): void;

  /** Zoekt een account op basis van gebruikersnaam. */
  getAccountByUsername(username: string): Account | undefined;
}
