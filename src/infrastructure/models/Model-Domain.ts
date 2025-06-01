import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../database';
import DomainStatus from '../../domain/Domainstatus';
import AccountModel from './Model-Account';

export interface DomainAttributes {
  DomainID: number;
  domainname: string;
  domainstatus: DomainStatus;
  startdatetime: Date;
  enddatetime: Date;
  AccountID: number;
}

interface DomainCreationAttributes extends Optional<DomainAttributes, 'DomainID'> {}

class DomainModel extends Model<DomainAttributes, DomainCreationAttributes> implements DomainAttributes {
  public DomainID!: number;
  public domainname!: string;
  public domainstatus!: DomainStatus;
  public startdatetime!: Date;
  public enddatetime!: Date;
  public AccountID!: number;

  public static associations: {
    account: Association<DomainModel, AccountModel>;
  };
}

DomainModel.init(
  {
    DomainID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    domainname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domainstatus: {
      type: DataTypes.ENUM("ONLINE", "OFFLINE", "DELETED", "BLOCKED"),
      allowNull: false,
    },
    startdatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    enddatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    AccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'AccountID',
      },
    },
  },
  {
    sequelize,
    tableName: 'Domain',
    modelName: 'DomainModel',
    timestamps: false,
  }
);



export default DomainModel;
