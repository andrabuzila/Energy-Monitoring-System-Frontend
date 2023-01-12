import { useState, useEffect} from "react";



export const usePersistState = (storageKey, initialState) => {
    const [state, setInternalState] = useState(initialState);
    useEffect(() => {
      var storageInLocalStorage;
      if(localStorage.getItem(storageKey) !== null){

        storageInLocalStorage = localStorage.getItem(storageKey);

      }else{

        storageInLocalStorage = null;

      }
      if (storageInLocalStorage) {

        setInternalState(storageInLocalStorage);

      }

    }, []);

    const setState = (newState) => {

      localStorage.setItem(storageKey, newState);

      setInternalState(newState);

    };
    return [state, setState];

  };