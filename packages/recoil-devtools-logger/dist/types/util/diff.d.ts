export declare type DiffKind = 'E' | 'N' | 'D' | 'A';
export interface Logger {
    groupCollapsed: (...data: any[]) => void;
    group: (...data: any[]) => void;
    log: (...data: any[]) => void;
    groupEnd: () => void;
}
export declare function style(kind: DiffKind): string;
export declare function render(diff: any): any[];
export default function diffLogger(prevState: any, newState: any, logger: Logger, isCollapsed: any): void;
