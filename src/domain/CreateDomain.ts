import Domain from "./Domain";
import Result from "./Result";
import ICheckDomain from "./ICheckDomain";
import Domainstatus from './Domainstatus';
import DomainDuration from './DomainDuration';
import PriceModel from './Pricemodel';


class CreateDomain {
    // private checkDomains: ICheckDomain[]; 

    constructor(
        domainName: string,
        Domainstatus: Domainstatus,
        domainDuration: DomainDuration,
        pricemodel: PriceModel,      
    ) 
    {
        // this.checkDomains = checkDomains; 
    }

    
    public createDomain(domainName: string, DomainStatus: Domainstatus, domainDuration: DomainDuration,
        priceModel: PriceModel): Result {
    
            
        const domain = new Domain(domainName, DomainStatus, domainDuration, priceModel);
        
        return new Result(true, `Domain ${domain.getDomainName()} is created`);
    
    }

    // public checkDomainAvailability(domain: Domain): Result {
    //     for (const checkDomain of this.checkDomains) {
    //         const checkResult = checkDomain.checkDomain(domain);
    //         if (!checkResult.success) {
    //             return checkResult;
    //         }
    //     }

    //     return new Result(true, `Domain ${domain.getDomainName()} is available`);
    // }
}
