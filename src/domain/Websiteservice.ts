import WebsiteRepository from "../infrastructure/repositories/WebsiteRepository";

export default class WebsiteService {
  constructor(private readonly websiteRepository: WebsiteRepository) {}

  async listAllWebsites() {
    return this.websiteRepository.getAllWebsites();
  }

  
}