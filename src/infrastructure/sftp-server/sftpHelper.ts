import fs from 'fs/promises';
import path from 'path';
import SftpClientWrapper from './sftpClient';
import WebsiteType from '../../domain/WebsiteType';

interface SftpConfig {
  host: string;
  port?: number;
  username: string;
  password: string;
}

class SftpHelper {
  private sftp: SftpClientWrapper;
  private config: SftpConfig;

  constructor(config: SftpConfig) {
    this.config = config;
    this.sftp = new SftpClientWrapper();
  }

  public async pushDomainAssets(
    name: string,
    domainname: string,
    start: Date,
    end: Date,
    type: WebsiteType,
    filePath?: string,
    fileName?: string
  ): Promise<void> {
    const tmpDir = path.resolve('tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    const tmpFile = path.join(tmpDir, `${domainname}.json`);

    const config = {
      name,
      domainname,
      startdatetime: start.toISOString(),
      enddatetime: end.toISOString(),
      type,
      filename: fileName ?? null,
    };

    await fs.writeFile(tmpFile, JSON.stringify(config, null, 2), 'utf8');

    try {
      await this.sftp.connect({
        host: this.config.host,
        port: this.config.port ?? 22,
        username: this.config.username,
        password: this.config.password,
      });

      const remoteDir = `/${domainname}`;
      await this.sftp.ensureDir(remoteDir);
      await this.sftp.upload(tmpFile, `${remoteDir}/config.json`);

      if (filePath && fileName) {
        await this.sftp.upload(filePath, `${remoteDir}/${fileName}`);
      }
    } finally {
      await this.sftp.disconnect();
      await fs.unlink(tmpFile);
    }
  }

  
 public async deleteDomainAssets(domainname: string): Promise<void> {
    try {
      await this.sftp.connect({
        host: this.config.host,
        port: this.config.port ?? 22,
        username: this.config.username,
        password: this.config.password,
      });

      const remoteDir = `/${domainname}`;
      await this.sftp.deleteDir(remoteDir);

    } catch (error) {
      console.error("SFTP delete failed:", error);
      throw error;  
    } finally {
      await this.sftp.disconnect();
    }
  }


}

export default SftpHelper;
