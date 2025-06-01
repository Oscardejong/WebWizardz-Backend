import { Request, Response } from "express";
import DomainRepository from "../infrastructure/repositories/DomainRepository";
import AccountRepository from "../infrastructure/repositories/AccountRepository";
import DomainStatus from "../domain/Domainstatus";
import Result from "../domain/Result";
import Domain from "../domain/Domain";
import DomainService from "../domain/Domainservice";
import IAccountCatalog from "../domain/IAccountCatalog";
import ICheckDomain from "../domain/ICheckDomain";
import DomainDateCheck  from "../domain/DomainDateCheck";
import DomainNameCheck from "../domain/DomainNameCheck";
import DomainPeriodOverlapCheck from "../domain/DomainPeriodOverlapCheck";
import ICheckDomainUpdate from "../domain/ICheckDomainUpdate";
import DomainPeriodCheckDate from "../domain/DomainPeriodCheckDate";
import DomainPeriodCheckStatus from "../domain/DomainPeriodCheckStatus";


class DomainController {
    private domainRepository: DomainRepository;
    private accountRepository: AccountRepository;
    private domainService: DomainService;
    private accountCatalog: IAccountCatalog;
  
    constructor(domainRepository: DomainRepository, accountRepository: AccountRepository, accountCatalog: IAccountCatalog) {
      this.accountRepository = accountRepository;
      this.domainRepository = domainRepository;
      this.domainService = new DomainService(this.domainRepository);
      this.accountCatalog = accountCatalog;
    } 
  
    async createDomain(req: Request, res: Response): Promise<void> {
      try {
        console.log('Received request body:', req.body);

        const requiredFields = ['domainname', 'domainstatus', 'startdatetime', 'enddatetime', 'username'];
        for (const field of requiredFields) {
          if (!req.body[field]) {
            console.warn(`Missing required field: ${field}`);
            res.status(400).json({ error: `Missing required field: ${field}` });
            return;
          }


          if (field === 'domainstatus' && !Object.values(DomainStatus).includes(req.body[field])) {
            console.warn(`Invalid domain status: ${req.body[field]}`);
            res.status(400).json({ error: `Invalid domain status: ${req.body[field]}` });
            return;
          }
        }

        const {
          domainname,
          domainstatus,
          startdatetime,
          enddatetime,
          username
        } = req.body;
  
        // 1. Maak eerst een domein aan in de domeinlaag (voor validatie)
        const domain = new Domain(
          domainname,
          domainstatus as DomainStatus,
          new Date(startdatetime),
          new Date(enddatetime)
        );
  


        const accountid = await this.accountRepository.getAccountByUsername(username);
        if (!accountid) {
          res.status(404).json({
            success: false,
            message: 'Account niet gevonden'
          });
          return;
        }

        // -------- Business-validatie via ICheckAccountAndUser ---------------
        // *1 stap: lijst van checks opbouwen

        const validators: ICheckDomain[] = [
          new DomainDateCheck(this.accountCatalog),
          new DomainNameCheck(this.accountCatalog)
        
        ];

        // *2 stap: lijst van checks opbouwen
        for (const validator of validators) {
                const result = validator.checkDomain(domain, this.accountCatalog);
                if (!result.success) {
                res.status(400).json({ error: result.message }); 
                return; 
              }

            }


        // 2 Gebruik domainRepository om het domein op te slaan
        const createdDomain = await this.domainRepository.createDomain({
          domainname: domain.getDomainName(),
          domainstatus: domain.getDomainstatus(),
          startdatetime: domain.getStartDate(),
          enddatetime: domain.getEndDate(),
          AccountID: accountid.AccountID
        });
  
        res.status(201).json({
          success: true,
          message: 'Domein succesvol aangemaakt',
          data: createdDomain
        });
      } catch (error: any) {
        console.error('Fout bij createDomain:', error);
        res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }

    async getAllDomains(req: Request, res: Response): Promise<void> {
      try {
        const domains = await this.domainService.listAllDomains(); // gebruik this.domainService
        res.status(200).json({ success: true, data: domains });
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    }

    async deleteDomainByDomainName(req: Request, res: Response): Promise<void> {
      try {
          // Haal de domainname op uit de URL-parameter
          const { domainname } = req.params;

          // Controleer of het domein bestaat
          const domainExists = await this.domainRepository.getDomainByDomainName(domainname);

          if (!domainExists) {
              res.status(404).json({
                  success: false,
                  message: 'Domein niet gevonden'
              });
              return;
          }

          // Verwijder het domein
          await this.domainRepository.deleteDomainByName(domainname);

          // Return succesmelding
          res.status(200).json({
              success: true,
              message: 'Domein succesvol verwijderd'
          });
      } catch (error: any) {
          console.error('Fout bij deleteDomainByDomainName:', error);
          res.status(400).json({
              success: false,
              message: error.message
          });
      }
    }


/* ---------- UPDATE PERIOD ---------- */
async updateDomainPeriod(req: Request, res: Response): Promise<void> {
  try {
    const { domainname } = req.params;
    const { startdatetime, enddatetime } = req.body;

    /* 1) Basis-validatie input */
    const newStart = new Date(startdatetime);
    const newEnd   = new Date(enddatetime);
    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime()) || newStart >= newEnd) {
      res.status(400).json({ success: false, message: 'Invalid date range' });
      return;
    }

    /* 2) Huidige domein ophalen */
    const current = await this.domainRepository.getDomainByDomainName(domainname);
    if (!current) {
      res.status(404).json({ success: false, message: 'Domain not found' });
      return;
    }

    /* 3) Domeinobject voor validators */
    const domainObj = new Domain(
      current.domainname,
      current.domainstatus,
      current.startdatetime,
      current.enddatetime
    );

    /* 4) Lijst met ICheckDomainUpdate-validators */
    const updateValidators: ICheckDomainUpdate[] = [
      new DomainPeriodOverlapCheck(this.accountCatalog)
      , new DomainPeriodCheckDate(this.accountCatalog),
      new DomainPeriodCheckStatus(this.accountCatalog)
      // voeg hier eventueel extra update-validators toe
    ];

    /* 5) Loop door validators */
    for (const v of updateValidators) {
      const result = v.checkDomainUpdate(domainObj, newStart, newEnd);
      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }
    }

    /* 6) Repo-update uitvoeren */
    const updated = await this.domainRepository.updateDomainPeriod(domainname, newStart, newEnd);

    res.status(200).json({
      success: true,
      message: 'Domain period updated',
      data: updated
    });
  } catch (error: any) {
    console.error('updateDomainPeriod error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

}
  
export default DomainController;
