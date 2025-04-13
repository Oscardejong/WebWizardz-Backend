
class Hosting {
    private hostingProvider: string = "Webwizardz";
    private storageSpace: number;
    private serverLocation: string;

    constructor(storageSpace: number, serverLocation: string) {
        this.storageSpace = storageSpace;
        this.serverLocation = serverLocation;
    }

    public getHostingProvider(): string {
        return this.hostingProvider;
    }

    public getStorageSpace(): number {
        return this.storageSpace;
    }

    public getServerLocation(): string {
        return this.serverLocation;
    }
}

export default Hosting;