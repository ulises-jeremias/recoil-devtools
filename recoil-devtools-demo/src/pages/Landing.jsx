import { useEffect } from 'react';
import { commonNotification } from 'app/state';

import "./Landing.css";
import { useSetRecoilState } from 'recoil';

const Landing = () => {
  const setNotification = useSetRecoilState(commonNotification);

  useEffect(() => {
    setNotification({
      isVisible: true,
      message: 'Hi!',
    });
  }, []);

  return null;
};

export default Landing;
