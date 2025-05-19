import DomainRepository from "../infrastructure/repositories/DomainRepository";


export default class DomainService {
  constructor(private readonly domainRepository: DomainRepository) {}

  async listAllDomains() {
    
    return this.domainRepository.getAllDomains();
  }

  
}