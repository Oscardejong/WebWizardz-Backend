import DomainModel from "../models/Model-Domain";
import AccountModel from "../models/Model-Account";
import DomainStatus from "../../domain/Domainstatus";
import { Op } from "sequelize";

class DomainRepository {
  async createDomain(domainData: {
    domainname: string;
    domainstatus: DomainStatus;
    startdatetime: Date;
    enddatetime: Date;
    AccountID: number;
  }): Promise<DomainModel> {
    try {
      return await DomainModel.create(domainData);
    } catch (err: any) {
      throw new Error(`Failed to create domain: ${err.message}`);
    }
  }

  async getAllDomains(): Promise<any[]> {
    try {
      const domains = await DomainModel.findAll({
        include: [
          {
            model: AccountModel,
            as: "account",
            attributes: ["username"],
          },
        ],
      });

      return domains.map((d: any) => {
        const plain = d.get({ plain: true });
        const username = plain.account?.username ?? null;
        delete plain.account;
        return { ...plain, username };
      });
    } catch (err: any) {
      throw new Error(`Failed to fetch domains: ${err.message}`);
    }
  }

  async getDomainsByAccountId(accountId: number): Promise<DomainModel[]> {
    try {
      return await DomainModel.findAll({ where: { AccountID: accountId } });
    } catch (err: any) {
      throw new Error(`Failed to fetch domains for AccountID ${accountId}: ${err.message}`);
    }
  }

  async getDomainByDomainName(domainname: string): Promise<DomainModel | null> {
    try {
      return await DomainModel.findOne({ where: { domainname } });
    } catch (err: any) {
      throw new Error(`Failed to fetch domain "${domainname}": ${err.message}`);
    }
  }

  async deleteDomainByName(domainname: string): Promise<void> {
    try {
      const domain = await DomainModel.findOne({ where: { domainname } });
      if (!domain) {
        throw new Error(`Domain "${domainname}" does not exist.`);
      }
      await domain.destroy();
    } catch (err: any) {
      throw new Error(`Failed to delete domain "${domainname}": ${err.message}`);
    }
  }

  async getDomainById(domainId: number): Promise<DomainModel | null> {
    try {
      return await DomainModel.findOne({ where: { DomainID: domainId } });
    } catch (err: any) {
      throw new Error(`Failed to fetch domain with ID ${domainId}: ${err.message}`);
    }
  }

}

export default DomainRepository;
