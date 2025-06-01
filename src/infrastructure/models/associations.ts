import AccountModel from './Model-Account';
import CustomerModel from './Model-Customer';
import DomainModel from './Model-Domain';
import WebsiteModel from './Model-Website';

export default function setupAssociations() {
  // Account ↔ Customer
  CustomerModel.hasOne(AccountModel, {
    foreignKey: 'CustomerID',
    as: 'account',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  AccountModel.belongsTo(CustomerModel, {
    foreignKey: 'CustomerID',
    as: 'customer',
  });

  // Account ↔ Domain
  AccountModel.hasMany(DomainModel, {
    foreignKey: 'AccountID',
    as: 'domains',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  DomainModel.belongsTo(AccountModel, {
    foreignKey: 'AccountID',
    as: 'account',
  });

  // Domain ↔ Website
  DomainModel.hasMany(WebsiteModel, {
    foreignKey: 'DomainID',
    as: 'websites',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  WebsiteModel.belongsTo(DomainModel, {
    foreignKey: 'DomainID',
    as: 'domain',
  });
}