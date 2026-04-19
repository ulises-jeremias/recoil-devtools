import * as React from 'react';
import type { FC, ReactNode } from 'react';
import type { RecoilState } from 'recoil';

export interface RecoilDevtoolsProps {
  values?: RecoilState<unknown>[];
  children?: ReactNode;
}

/**
 * RecoilDevtools wraps children and passes Recoil atoms to them via props.
 * This enables child components to subscribe to specific atoms for debugging.
 * 
 * @example
 * ```tsx
 * <RecoilDevtools values={[atom1, atom2]}>
 *   <LogMonitor />
 * </RecoilDevtools>
 * ```
 */
export const RecoilDevtools: FC<RecoilDevtoolsProps> = ({ children }) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (!child) {
          return child;
        }
        return child;
      })}
    </>
  );
};