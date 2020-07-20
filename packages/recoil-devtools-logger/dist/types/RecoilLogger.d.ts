import { FC } from 'react';
import { RecoilState } from 'recoil';
export declare type Logger = (next: Function) => ({ prevState, nextState }: {
    prevState: any;
    nextState: any;
}) => any;
export interface RecoilLoggerProps {
    values?: RecoilState<any>[];
    logger?: Logger;
    next?: Function;
    actionTransformer?: Function;
}
export declare const RecoilLogger: FC<RecoilLoggerProps>;
