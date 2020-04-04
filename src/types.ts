export interface IActionArguments {
    ftp_server: string | undefined;
    ftp_username: string | undefined;
    ftp_password: string | undefined;

    /** @default "." */
    local_dir: string | undefined;

    /** @default "" */
    gitFtpArgs: string | undefined;

    /** @default "" */
    knownHosts: string | undefined;
}

/**
 * @see https://github.com/git-ftp/git-ftp/blob/master/man/git-ftp.1.md#exit-codes
 */
export enum gitFTPExitCode {
    Successful = 0,
    UnknownError = 1,
    WrongUsage = 2,
    MissingArguments = 3,
    ErrorWhileUploading = 4,
    ErrorWhileDownloading = 5,
    UnknownProtocol = 6,
    RemoteLocked = 7,
    NotAGitProject = 8,
    PreFTPPushHookFailed = 9,
    LocalFileOperationFailed = 10
}
