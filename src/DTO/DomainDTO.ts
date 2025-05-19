
export interface CreateDomainDTO {
    domainname: string;
    domainstatus: string; 
    startdatetime: string; // Dit is een string die je later om zou zetten naar een Date
    enddatetime: string;   // Dit is een string die je later om zou zetten naar een Date
    AccountID: number; // Dit is een nummer dat verwijst naar de account ID
  }
  