import WebsiteModel from "../models/Model-Website";
import DomainModel from "../models/Model-Domain";
import Status from "../../domain/Status";
import WebsiteType from "../../domain/WebsiteType";

// Je SFTP helper import (vul zelf aan met jouw implementatie)
import SftpHelper from "../sftp-server/sftpHelper";
import dotenv from "dotenv";

export interface CreateWebsite {
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

dotenv.config();
const sftpConfig = {
  host: process.env.SFTP_HOST ?? "",
  port: process.env.SFTP_PORT ? parseInt(process.env.SFTP_PORT) : 22,
  username: process.env.SFTP_USER ?? "",
  password: process.env.SFTP_PASS ?? "",
};


class WebsiteRepository {
  private sftpHelper = new SftpHelper(sftpConfig);
  

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
      // 1. Zoek domainname op basis van websiteId
      const domainname = await this.getDomainNameByWebsiteId(websiteId);
      if (!domainname) {
        throw new Error(`Domain not found for website ID ${websiteId}`);
      }

      // 2. Delete in SFTP (remote folder/file)
      await this.deletesftpWebsite(domainname);

      // 3. Delete website uit database
      await WebsiteModel.destroy({ where: { WebsiteID: websiteId } });
    } catch (err: any) {
      throw new Error(`Failed to delete website with ID ${websiteId}: ${err.message}`);
    }
  }

  // Verwijder remote folder in SFTP, gebaseerd op domainname
  async deletesftpWebsite(domainname: string): Promise<void> {
    try {
      // Hier je SFTP logic, bijvoorbeeld:
    await this.sftpHelper.deleteDomainAssets(domainname);

    } catch (err: any) {
      throw new Error(`Failed to delete SFTP folder for domain "${domainname}": ${err.message}`);
    }
  }

  async getDomainNameByWebsiteId(websiteId: number): Promise<string | null> {
    try {
      const website = await WebsiteModel.findOne({
        where: { WebsiteID: websiteId },
        include: [{
          model: DomainModel,
          as: "domain",
          attributes: ["domainname"],
        }],
      });

      if (!website) {
        return null;
      }

      const plain = website.get({ plain: true }) as any;
      if (!plain.domain) {
        return null;
      }

      return plain.domain.domainname;
    } catch (err: any) {
      throw new Error(`Failed to fetch domainname for website ID ${websiteId}: ${err.message}`);
    }
  }
}

export default WebsiteRepository;
