type iMessage = 'success' | 'info' | 'error' | 'warning' | 'loading';
export declare class Serial {
    private alias;
    port: any;
    parser: any;
    onInfo: (type: iMessage, _log: {
        type: string;
        message: string;
    }) => any;
    constructor();
    check: () => boolean;
    start: (path: string, baud: number) => void;
    on: (cb: any) => void;
    emit: (data: any) => void;
    close: () => void;
}
export {};
//# sourceMappingURL=serial.d.ts.map