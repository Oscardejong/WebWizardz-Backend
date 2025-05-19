import WebsiteModel from "../models/Model-Website";
import DomainModel from "../models/Model-Domain";
import Status from "../../domain/Status";
import WebsiteType from "../../domain/WebsiteType";

interface CreateWebsite {
  name: string;
  status: Status;
  type: WebsiteType;
  path: string | null;
  originalname: string | null;
  size: number | null;
  mimetype: string | null;
  uploadedat: Date | null;
  DomainID: number;
}

class WebsiteRepository {
  async createWebsite(websiteData: CreateWebsite): Promise<WebsiteModel> {
    try {
      return await WebsiteModel.create(websiteData);
    } catch (err: any) {
      throw new Error(`Failed to create website: ${err.message}`);
    }
  }

  async getAllWebsites(): Promise<any[]> {
    try {
      const websites = await WebsiteModel.findAll({
        include: [
          {
            model: DomainModel,
            as: "domain",
            attributes: ["domainname"],
          },
        ],
      });

      return websites.map((w: any) => {
        const plain = w.get({ plain: true });
        const domainname = plain.domain?.domainname ?? null;
        delete plain.domain;
        return { ...plain, domainname };
      });
    } catch (err: any) {
      throw new Error(`Failed to fetch websites: ${err.message}`);
    }
  }

  async getWebsitesByDomainID(domainId: number): Promise<WebsiteModel[]> {
    try {
      return await WebsiteModel.findAll({ where: { DomainID: domainId } });
    } catch (err: any) {
      throw new Error(`Failed to fetch websites for DomainID ${domainId}: ${err.message}`);
    }
  }

  async getWebsiteByName(name: string): Promise<WebsiteModel | null> {
    try {
      return await WebsiteModel.findOne({ where: { name } });
    } catch (err: any) {
      throw new Error(`Failed to fetch website "${name}": ${err.message}`);
    }
  }

  async deleteWebsite(websiteId: number): Promise<void> {
    try {
      await WebsiteModel.destroy({ where: { WebsiteID: websiteId } });
    } catch (err: any) {
      throw new Error(`Failed to delete website with ID ${websiteId}: ${err.message}`);
    }
  }
}

export default WebsiteRepository;
