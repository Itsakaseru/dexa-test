export class GlobalConfig {
    public dirPath: string;
    public uploadPath: string;
    public tempPath: string;

    constructor(dirPath: string) {
        this.dirPath = dirPath;
        this.uploadPath = `${dirPath}/uploads`;
        this.tempPath = `${dirPath}/temp`;
    }
}