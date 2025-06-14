import Client from 'ssh2-sftp-client';

export interface SftpCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
}

class SftpClientWrapper {
  private client = new Client();

  async connect(creds: SftpCredentials) {
    await this.client.connect({
      host: creds.host,
      port: creds.port,
      username: creds.username,
      password: creds.password,
    });
  }

  async ensureDir(path: string) {
    const exists = await this.client.exists(path);
    if (!exists) await this.client.mkdir(path, true);
  }

  async upload(local: string, remote: string) {
    await this.client.put(local, remote);
  }

   async deleteDir(remotePath: string) {
    // Bestaat de map?
    const exists = await this.client.exists(remotePath);
    if (exists) {
      // Recursief verwijderen van bestanden en mappen
      // ssh2-sftp-client heeft een 'rmdir' met recursive optie
      await this.client.rmdir(remotePath, true); // true = recursive
    }
  }

  async disconnect() {
    await this.client.end();
  }
}

export default SftpClientWrapper;
