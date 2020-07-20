import { FC, ReactNode } from 'react';
import { RecoilState } from 'recoil';
export interface RecoilDevtoolsProps {
    values?: RecoilState<any>[];
    children?: ReactNode;
}
export declare const RecoilDevtools: FC<RecoilDevtoolsProps>;
