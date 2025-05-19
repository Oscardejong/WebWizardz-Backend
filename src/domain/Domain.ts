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
}

export default Domain;
