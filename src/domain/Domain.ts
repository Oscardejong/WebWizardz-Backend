import Account from './Account';
import Domainstatus from './Domainstatus';
import PriceModel from './Pricemodel';
import Result from './Result';
import Website from './Website';

class Domain {

    private domainName: string;
    private Domainstatus: Domainstatus;
    private startDate: Date;
    private endDate: Date;

    private pricemodels: PriceModel[];
    private websites: Website[];

    constructor(
        domainName: string,
        domainstatus: Domainstatus = Domainstatus.ONLINE,  // Correcte manier om een standaardwaarde te gebruiken
        startDate: Date,
        endDate: Date,
    ) {

        this.domainName = domainName;
        this.Domainstatus = domainstatus;

        if (startDate > endDate) {
            throw new Error('End date cannot be earlier than start date');
        }
        this.startDate = startDate;
        this.endDate = endDate;

        // Initialisatie van de arrays
        this.pricemodels = [];
        this.websites = [];
    }

    public changeStatus(newStatus: Domainstatus): Result {
        // Validatie voor nieuwe status
        if (!Object.values(Domainstatus).includes(newStatus)) {
            return new Result(false, 'Invalid status');
        }

        this.Domainstatus = newStatus;
        return new Result(true, 'Domain status updated successfully');
    }

    getDomainName(): string {
        return this.domainName;
    }

    getDomainstatus(): Domainstatus {
        return this.Domainstatus;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getPricemodels(): PriceModel[] {
        return this.pricemodels;
    }

    getWebsites(): Website[] {
        return this.websites;
    }

    hasWebsite(): boolean {
    return this.websites.length > 0;
  }
    
 static fromModel(domainModel: any): Domain {
  const domain = new Domain(
    domainModel.domainname,
    domainModel.domainstatus as Domainstatus,
    new Date(domainModel.startdatetime),
    new Date(domainModel.enddatetime)
  );

  if (domainModel.websites && Array.isArray(domainModel.websites)) {
    for (const websiteModel of domainModel.websites) {
      const fileInfo = {
        path: websiteModel.path || '',
        originalname: websiteModel.originalname || '',
        size: websiteModel.size || 0,
        mimetype: websiteModel.mimetype || '',
        uploadedat: websiteModel.uploadedat ? new Date(websiteModel.uploadedat) : new Date(),
      };

      const website = new Website(
        websiteModel.name,
        websiteModel.status,
        websiteModel.type,
        fileInfo
      );

      domain.tryAddWebsite(website);
    }
  }

  return domain;
}



    // Domain.ts
tryAddWebsite(website: Website): Result {
  // if (this.Domainstatus != Domainstatus.ONLINE) {
  //   return new Result(false, `Cannot link website, status ${this.Domainstatus} is incorrect.`);
  // }

  if (this.websites.length > 0) {
    return new Result(false, 'This domain has allready a website');
  }

  this.websites.push(website);
  return new Result(true, 'Website succesfull added.');
}

}

export default Domain;
