import Domainstatus from './Domainstatus';
import DomainDuration from './DomainDuration';
import PriceModel from './Pricemodel';
import Result from './Result';
import Website from './Website';

class Domain {
    private domainName: string;
    private Domainstatus: Domainstatus;
    private domainDuration: DomainDuration;
    private pricemodels: PriceModel[];
    private websites: Website[];

    constructor(
        domainName: string,
        Domainstatus: Domainstatus,
        domainDuration: DomainDuration,
        pricemodel: PriceModel
    ) {
        this.domainName = domainName;
        this.Domainstatus = Domainstatus;
        this.domainDuration = domainDuration;
        this.pricemodels = [];
        this.websites = [];
    }

    public changeStatus(newStatus: Domainstatus): Result {
        this.Domainstatus = newStatus;
        return new Result(true, 'Domain status updated successfully');
    }
}

export default Domain;
