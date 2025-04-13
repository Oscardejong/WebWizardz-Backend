import Hosting from "./Hosting";
import Result from "./Result";

class Website {
    private url: string;
    private hosting: Hosting;

    constructor(url: string, hosting: Hosting) {
        this.url = url;
        this.hosting = hosting;
    }

    public changeHosting(newHosting: Hosting): Result {
        this.hosting = newHosting;
        return new Result(true, 'Hosting changed successfully');
    }
}

export default Website;