export interface IEnvironment {
    isProduction: boolean;
    hostname: string;
    port: number;
    whitelist: Set<string>;
    logDir: string;
}
