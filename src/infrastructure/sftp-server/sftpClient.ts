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

  async disconnect() {
    await this.client.end();
  }
}

export default SftpClientWrapper;
