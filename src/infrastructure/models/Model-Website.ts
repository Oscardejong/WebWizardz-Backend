import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../database';
import DomainModel from './Model-Domain';
import Status from '../../domain/Status';
import WebsiteType from '../../domain/WebsiteType';

interface WebsiteAttributes {
  WebsiteID: number;
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

interface WebsiteCreationAttributes extends Optional<WebsiteAttributes, 'WebsiteID'> {}

class WebsiteModel extends Model<WebsiteAttributes, WebsiteCreationAttributes> implements WebsiteAttributes {
  public WebsiteID!: number;
  public name!: string;
  public status!: Status;
  public type!: WebsiteType;
  public path!: string | null;
  public originalname!: string | null;
  public size!: number | null;
  public mimetype!: string | null;
  public uploadedat!: Date | null;
  public DomainID!: number;

  public static associations: {
    domain: Association<WebsiteModel, DomainModel>;
  };
}

WebsiteModel.init(
  {
    WebsiteID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Poster", "Ticket", "Canvas"),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    originalname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    mimetype: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploadedat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DomainID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: DomainModel,
        key: 'DomainID',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'Website',
    timestamps: false,
  }
);

// Associatie
WebsiteModel.belongsTo(DomainModel, { foreignKey: 'DomainID', as: 'domain' });

export default WebsiteModel;
