import { Request, Response } from "express";
import WebsiteRepository from "../infrastructure/repositories/WebsiteRepository";
import DomainRepository from "../infrastructure/repositories/DomainRepository";
import Status from "../domain/Status";
import WebsiteType from "../domain/WebsiteType";
import Website from "../domain/Website";
import { FileInfo } from "../domain/FileInfo";
import SftpHelper from "../infrastructure/sftp-server/sftpHelper";
import Domain from "../domain/Domain";
import { isFileValid } from "../domain/WebsiteCheckFile";
import ICheckDomainHasWebsite from "../domain/ICheckDomainhasWebsite";
import IAccountCatalog from "../domain/IAccountCatalog";
import WebsiteCheckDomain from "../domain/WebsiteCheckDomain";
import WebsiteCheckName from "../domain/WebsiteCheckName";
import ICheckWebsite from "../domain/ICheckWebsite";
import WebsiteService from "../domain/Websiteservice";

class WebsiteController {
  private websiteRepository = new WebsiteRepository();
  private domainRepository = new DomainRepository();
  private websiteService = new WebsiteService(this.websiteRepository);
  private websiteCheckDomain: ICheckDomainHasWebsite;

  constructor(private accountCatalog: IAccountCatalog) {
    this.websiteCheckDomain = new WebsiteCheckDomain(this.accountCatalog);
  }

  public createWebsite = async (req: Request, res: Response): Promise<void> => {
    try {
      const requiredFields = ["name", "domainname"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          res.status(400).json({ success: false, message: `Missing required field: ${field}` });
          return;
        }
      }

      const {
        name,
        domainname,
        status = Status.Active,
        type = WebsiteType.Poster,
        uploadedat,
      } = req.body;

      const file = req.file;

      const fileInfo: FileInfo | undefined = file
        ? {
            path: file.path,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            uploadedat: uploadedat ? new Date(uploadedat) : new Date(),
          }
        : undefined;

      const domainModel = await this.domainRepository.getDomainByDomainName(domainname);
      if (!domainModel) {
        res.status(400).json({ success: false, message: "Domain does not exist." });
        return;
      }

      const DomainID = domainModel.DomainID;
      const domain = Domain.fromModel(domainModel);
      const websiteDomainObj = new Website(name, status, type, fileInfo);

      if (type === WebsiteType.Poster && !file) {
        res.status(400).json({ success: false, message: "File upload is required when website type is Poster." });
        return;
      }

      const fileValidation = isFileValid(fileInfo);
      if (!fileValidation.success) {
        res.status(400).json({ success: false, message: fileValidation.message });
        return;
      }

      const domainCheckResult = this.websiteCheckDomain.checkDomainHasWebsite(domainname, this.accountCatalog);
      if (!domainCheckResult.success) {
        res.status(400).json({ success: false, message: domainCheckResult.message });
        return;
      }

      const validators: ICheckWebsite[] = [
        new WebsiteCheckName(this.accountCatalog),
      ];

      for (const validator of validators) {
        const result = validator.check(websiteDomainObj, this.accountCatalog);
        if (!result.success) {
          res.status(400).json({ success: false, message: result.message });
          return;
        }
      }

      const validation = domain.tryAddWebsite(websiteDomainObj);
      if (!validation.success) {
        res.status(400).json({ success: false, message: validation.message });
        return;
      }

      const createdWebsite = await this.websiteRepository.createWebsite({
        name: websiteDomainObj.getName(),
        status: websiteDomainObj.getStatus(),
        type: websiteDomainObj.getType(),
        DomainID,
        path: fileInfo?.path ?? null,
        originalname: fileInfo?.originalname ?? null,
        size: fileInfo?.size ?? null,
        mimetype: fileInfo?.mimetype ?? null,
        uploadedat: fileInfo?.uploadedat ?? null,
      });

      res.status(201).json({ success: true, message: "Website successfully created.", data: createdWebsite });

      try {
        const sftp = new SftpHelper({
          host: process.env.SFTP_HOST!,
          port: Number(process.env.SFTP_PORT) || 22,
          username: process.env.SFTP_USER!,
          password: process.env.SFTP_PASS!,
        });

        await sftp.pushDomainAssets(
          name,
          domainname,
          domain.getStartDate(),
          domain.getEndDate(),
          type,
          fileInfo?.path,
          fileInfo?.originalname
        );
      } catch (sftpErr) {
        console.error("SFTP upload failed:", sftpErr);
      }
    } catch (error: any) {
      console.error("Error creating website:", error);
      res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  public getAllWebsites = async (req: Request, res: Response): Promise<void> => {
    try {
      const websites = await this.websiteService.listAllWebsites();
      res.status(200).json({ success: true, data: websites });
    } catch (error: any) {
      console.error("Error fetching websites:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  public deleteWebsiteByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ success: false, message: "Website name is required" });
        return;
      }

      const website = await this.websiteRepository.getWebsiteByName(name);
      if (!website) {
        res.status(404).json({ success: false, message: `Website with name ${name} not found.` });
        return;
      }

      await this.websiteRepository.deleteWebsite(website.WebsiteID);

      res.status(200).json({ success: true, message: `Website with name ${name} was deleted successfully.` });
    } catch (error: any) {
      console.error("Error deleting website:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}

export default WebsiteController;
