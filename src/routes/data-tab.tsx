import { useParams } from 'react-router';

export const DataTab = () => {
  const { tab } = useParams();
  return <>{tab}</>;
};
