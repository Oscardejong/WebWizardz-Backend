// domain/ICheckDomainUpdate.ts
import Result from './Result';
import Domain from './Domain';

export default interface ICheckDomainUpdate {
  /** 
   * @param currentDomain   het domein dat je gaat updaten (oude waarden!)  
   * @param newStart        nieuwe startdatetime  
   * @param newEnd          nieuwe enddatetime  
   */
  checkDomainUpdate(
    currentDomain: Domain,
    newStart: Date,
    newEnd: Date
  ): Result;
}
