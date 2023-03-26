import { FC, PropsWithChildren } from 'react';
import {
  InPortal,
  OutPortal,
  createHtmlPortalNode,
} from 'react-reverse-portal';
import { selectorFamily, useRecoilValue } from 'recoil';

const slotPortalNodeState = selectorFamily({
  key: 'slotPortalNode',
  dangerouslyAllowMutability: true,
  get: (slotId: string) => () => createHtmlPortalNode(),
});

export const SlotIn: FC<PropsWithChildren<{ slotId: string }>> = ({
  slotId,
  children,
}) => {
  const node = useRecoilValue(slotPortalNodeState(slotId));

  return <InPortal node={node}>{children}</InPortal>;
};

export const SlotOut: FC<{ slotId: string }> = ({ slotId }) => {
  const node = useRecoilValue(slotPortalNodeState(slotId));

  return <OutPortal node={node} />;
};
