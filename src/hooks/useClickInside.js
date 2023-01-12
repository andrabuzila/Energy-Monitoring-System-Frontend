import { useRef, useEffect } from 'react';

export const useClickInside = (callBack) => {
  const ref = useRef();

  const onClickHandler = (e) => {
    if (e.target === ref.current) {
      callBack();
    }
  };

  useEffect(() => {
    document.addEventListener('click', onClickHandler);

    return () => {
      document.removeEventListener('click', onClickHandler);
    };
    // eslint-disable-next-line
  }, []);

  return ref;
};
