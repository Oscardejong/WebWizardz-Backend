"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hosting {
    constructor(storageSpace, serverLocation) {
        this.hostingProvider = "Webwizardz";
        this.storageSpace = storageSpace;
        this.serverLocation = serverLocation;
    }
    getHostingProvider() {
        return this.hostingProvider;
    }
    getStorageSpace() {
        return this.storageSpace;
    }
    getServerLocation() {
        return this.serverLocation;
    }
}
exports.default = Hosting;
