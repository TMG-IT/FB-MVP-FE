import React, {
  createContext,
  useContext,
  useReducer,
  Reducer,
  Dispatch
} from 'react';
import { ISessionData } from '../pages/SessionCodeEntry/SessionCodeEntry';

interface IState {
  sessionData: ISessionData;
  isSessionConfirmed: boolean;
  isModalShowing: boolean;
  modalTitle: string;
  modalText: string;
  isModalLoading: boolean;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  isHeaderDark: boolean;
}

interface IContextProps {
  state: IState;
  dispatch: Dispatch<any>;
}

export const StateContext = createContext({} as IContextProps);

interface IStateProvider {
  reducer: Reducer<any, any>;
  initialState: Object;
}

export const StateProvider: React.FC<IStateProvider> = ({
  reducer,
  initialState,
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);

export const initialState: IState = {
  sessionData: {
    coachName: '',
    sessionName: '',
    sessionCode: '',
    questionList: [],
    collectContactData: false,
    uuid: ''
  },
  isSessionConfirmed: false,
  isModalShowing: false,
  modalTitle: '',
  modalText: '',
  isModalLoading: false,
  privacyAccepted: false,
  termsAccepted: false,
  isHeaderDark: false
};

export const reducer = (state: Object, action: any) => {
  switch (action.type) {
    case 'setSessionData':
      return {
        ...state,
        sessionData: action.payload
      };
    case 'confirmSession':
      return {
        ...state,
        isSessionConfirmed: true
      };
    case 'showModal':
      document.body.className = 'hidden';
      return {
        ...state,
        isModalShowing: true
      };
    case 'hideModal':
      document.body.className = '';
      return {
        ...state,
        isModalShowing: false
      };
    case 'setModalData': {
      return {
        ...state,
        modalTitle: action.payload.title,
        modalText: action.payload.text
      };
    }
    case 'setIsModalLoading': {
      return {
        ...state,
        isModalLoading: action.payload
      };
    }
    case 'setTermsAccepted':
      return {
        ...state,
        termsAccepted: action.payload
      };

    case 'setPrivacyAccepted':
      return {
        ...state,
        privacyAccepted: action.payload
      };
    case 'setHeaderDark': {
      return {
        ...state,
        isHeaderDark: true
      };
    }
    case 'setHeaderLight': {
      return {
        ...state,
        isHeaderDark: false
      };
    }
    default:
      return state;
  }
};
