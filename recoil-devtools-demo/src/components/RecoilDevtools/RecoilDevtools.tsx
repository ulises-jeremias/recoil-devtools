import React, { FC, Children, ReactNode } from 'react';
import { RecoilState } from 'recoil';

export interface RecoilDevtoolsProps {
  values?: RecoilState<any>[];
  children?: ReactNode;
}

const RecoilDevtools: FC<RecoilDevtoolsProps> = ({ values, children }) => {
  return (
    <>
      {Children.map(children, (child: ReactNode) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        return React.cloneElement(child, { values, ...child.props });
      })}
    </>
  );
};

export default RecoilDevtools;
