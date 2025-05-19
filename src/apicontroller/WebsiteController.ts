import { Request, Response } from "express";
import WebsiteRepository from "../infrastructure/repositories/WebsiteRepository";
import DomainRepository from "../infrastructure/repositories/DomainRepository";
import Status from "../domain/Status";
import WebsiteType from "../domain/WebsiteType";
import Website from "../domain/Website";
import { FileInfo } from "../domain/FileInfo";
import SftpHelper from "../infrastructure/sftp-server/sftpHelper";

class WebsiteController {
  private websiteRepository: WebsiteRepository;
  private domainRepository: DomainRepository;

  constructor() {
    this.websiteRepository = new WebsiteRepository();
    this.domainRepository  = new DomainRepository();
  }

  // ---------- CREATE ----------
  public createWebsite = async (req: Request, res: Response): Promise<void> => {
    try {
      /* 1. Validate required fields */
      const requiredFields = ["name", "domainname"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          res.status(400).json({ success: false, message: `Missing required field: ${field}` });
          return;
        }
      }

      /* 2. Pull values from body */
      const {
        name,
        domainname,
        status = Status.Active,
        type   = WebsiteType.Poster,
        uploadedat,
      } = req.body;

      const file = req.file;

      /* 3. Compose fileInfo (optional) */
      const fileInfo: FileInfo | undefined = file
        ? {
            path: file.path,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            uploadedat: uploadedat ? new Date(uploadedat) : new Date(),
          }
        : undefined;

      /* 4. Find domain by name */
      const domain = await this.domainRepository.getDomainByDomainName(domainname);
      if (!domain) {
        res.status(400).json({ success: false, message: "Domain does not exist." });
        return;
      }

      const DomainID = domain.DomainID;

      /* 5. Poster requires file */
      if (type === WebsiteType.Poster && !file) {
        res.status(400).json({ success: false, message: "File upload is required when website type is Poster." });
        return;
      }

      /* 6. Build domain‑layer Website object (for validation) */
      const websiteDomainObj = new Website(name, status, type, fileInfo);

      /* 7. Persist */
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

      /* 8. Fire‑and‑forget SFTP upload — errors only logged */
      try {
        const sftp = new SftpHelper({
          host: process.env.SFTP_HOST!,
          port: Number(process.env.SFTP_PORT) || 22,
          username: process.env.SFTP_USER!,
          password: process.env.SFTP_PASS!,
        });

        // Let op: filePath en fileName alleen meegeven als fileInfo bestaat
        await sftp.pushDomainAssets(
          domainname,
          domain.startdatetime,
          domain.enddatetime,
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

  // ---------- READ ----------
  public getAllWebsites = async (req: Request, res: Response): Promise<void> => {
    try {
      const websites = await this.websiteRepository.getAllWebsites();
      res.status(200).json({ success: true, data: websites });
    } catch (error: any) {
      console.error("Error fetching websites:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ---------- DELETE ----------
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

export default new WebsiteController();
