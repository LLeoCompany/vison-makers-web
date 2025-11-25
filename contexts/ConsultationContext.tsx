/**
 * LeoFitTech 상담 시스템 Context
 * 설계 문서 2.3 기술 스택 기반 - React Context API 사용
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  ConsultationState,
  ConsultationAction,
  TrackType,
  ServiceType,
  ProjectSize,
  Budget,
  Timeline,
  ImportantFeature,
  ContactInfo,
  STORAGE_KEY,
} from "../types/consultation";

// 초기 상태
const initialState: ConsultationState = {
  trackType: null,
  currentStep: 0,
  totalSteps: 0,
  isLoading: false,
  error: null,

  guided: {
    serviceType: null,
    projectSize: null,
    budget: null,
    timeline: null,
    importantFeatures: [],
    additionalRequests: "",
    contact: {},
  },

  free: {
    description: "",
    contact: {},
  },
};

// 리듀서 함수
function consultationReducer(
  state: ConsultationState,
  action: ConsultationAction
): ConsultationState {
  switch (action.type) {
    case "SET_TRACK_TYPE":
      return {
        ...state,
        trackType: action.payload,
        totalSteps: action.payload === "guided" ? 4 : 1,
        currentStep: 1,
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_GUIDED_SERVICE_TYPE":
      return {
        ...state,
        guided: {
          ...state.guided,
          serviceType: action.payload,
        },
      };

    case "SET_GUIDED_PROJECT_SIZE":
      return {
        ...state,
        guided: {
          ...state.guided,
          projectSize: action.payload,
        },
      };

    case "SET_GUIDED_BUDGET":
      return {
        ...state,
        guided: {
          ...state.guided,
          budget: action.payload,
        },
      };

    case "SET_GUIDED_TIMELINE":
      return {
        ...state,
        guided: {
          ...state.guided,
          timeline: action.payload,
        },
      };

    case "SET_GUIDED_FEATURES":
      return {
        ...state,
        guided: {
          ...state.guided,
          importantFeatures: action.payload,
        },
      };

    case "SET_GUIDED_ADDITIONAL_REQUESTS":
      return {
        ...state,
        guided: {
          ...state.guided,
          additionalRequests: action.payload,
        },
      };

    case "SET_GUIDED_CONTACT":
      return {
        ...state,
        guided: {
          ...state.guided,
          contact: { ...state.guided.contact, ...action.payload },
        },
      };

    case "SET_FREE_DESCRIPTION":
      return {
        ...state,
        free: {
          ...state.free,
          description: action.payload,
        },
      };

    case "SET_FREE_CONTACT":
      return {
        ...state,
        free: {
          ...state.free,
          contact: { ...state.free.contact, ...action.payload },
        },
      };

    case "RESET_STATE":
      return initialState;

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}

// Context 생성
interface ConsultationContextType {
  state: ConsultationState;
  dispatch: React.Dispatch<ConsultationAction>;

  // Helper functions
  setTrackType: (trackType: TrackType) => void;
  nextStep: () => void;
  prevStep: () => void;
  setServiceType: (serviceType: ServiceType) => void;
  setProjectSize: (size: ProjectSize) => void;
  setBudget: (budget: Budget) => void;
  setTimeline: (timeline: Timeline) => void;
  setFeatures: (features: ImportantFeature[]) => void;
  setAdditionalRequests: (requests: string) => void;
  setContact: (contact: Partial<ContactInfo>, trackType: TrackType) => void;
  setFreeProject: (
    description: string,
    budget?: string,
    timeline?: string
  ) => void;
  setFreeDescription: (description: string) => void;
  resetState: () => void;
  saveToStorage: () => void;
  canProceedToNext: () => boolean;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(
  undefined
);

// Provider 컴포넌트
interface ConsultationProviderProps {
  children: ReactNode;
}

export function ConsultationProvider({ children }: ConsultationProviderProps) {
  const [state, dispatch] = useReducer(consultationReducer, initialState);

  // 로컬 스토리지에서 상태 복원
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsedState });
      }
    } catch (error) {
      console.warn("Failed to load state from localStorage:", error);
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장 (자동 저장)
  useEffect(() => {
    if (state.trackType) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn("Failed to save state to localStorage:", error);
      }
    }
  }, [state]);

  // Helper functions
  const setTrackType = (trackType: TrackType) => {
    dispatch({ type: "SET_TRACK_TYPE", payload: trackType });
  };

  const nextStep = () => {
    if (state.currentStep < state.totalSteps) {
      dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep - 1 });
    }
  };

  const setServiceType = (serviceType: ServiceType) => {
    dispatch({ type: "SET_GUIDED_SERVICE_TYPE", payload: serviceType });
  };

  const setProjectSize = (size: ProjectSize) => {
    dispatch({ type: "SET_GUIDED_PROJECT_SIZE", payload: size });
  };

  const setBudget = (budget: Budget) => {
    dispatch({ type: "SET_GUIDED_BUDGET", payload: budget });
  };

  const setTimeline = (timeline: Timeline) => {
    dispatch({ type: "SET_GUIDED_TIMELINE", payload: timeline });
  };

  const setFeatures = (features: ImportantFeature[]) => {
    dispatch({ type: "SET_GUIDED_FEATURES", payload: features });
  };

  const setAdditionalRequests = (requests: string) => {
    dispatch({ type: "SET_GUIDED_ADDITIONAL_REQUESTS", payload: requests });
  };

  const setContact = (contact: Partial<ContactInfo>, trackType: TrackType) => {
    if (trackType === "guided") {
      dispatch({ type: "SET_GUIDED_CONTACT", payload: contact });
    } else {
      dispatch({ type: "SET_FREE_CONTACT", payload: contact });
    }
  };

  const setFreeProject = (
    description: string,
    budget?: string,
    timeline?: string
  ) => {
    dispatch({ type: "SET_FREE_DESCRIPTION", payload: description });
    if (budget !== undefined) {
      // dispatch({ type: 'SET_FREE_BUDGET', payload: budget });
    }
    if (timeline !== undefined) {
      // dispatch({ type: 'SET_FREE_TIMELINE', payload: timeline });
    }
  };

  const setFreeDescription = (description: string) => {
    dispatch({ type: "SET_FREE_DESCRIPTION", payload: description });
  };

  const resetState = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET_STATE" });
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save state to localStorage:", error);
    }
  };

  // 다음 단계로 진행 가능한지 체크
  const canProceedToNext = (): boolean => {
    if (!state.trackType) return false;

    if (state.trackType === "guided") {
      switch (state.currentStep) {
        case 1:
          return !!state.guided.serviceType;
        case 2:
          return !!(state.guided.projectSize && state.guided.budget);
        case 3:
          return !!state.guided.timeline;
        case 4:
          return !!(
            state.guided.contact.name &&
            state.guided.contact.phone &&
            state.guided.contact.email
          );
        default:
          return false;
      }
    } else {
      // Free track
      return !!(
        state.free.description.trim() &&
        state.free.contact.name &&
        state.free.contact.phone &&
        state.free.contact.email
      );
    }
  };

  const value: ConsultationContextType = {
    state,
    dispatch,
    setTrackType,
    nextStep,
    prevStep,
    setServiceType,
    setProjectSize,
    setBudget,
    setTimeline,
    setFeatures,
    setAdditionalRequests,
    setContact,
    setFreeProject,
    setFreeDescription,
    resetState,
    saveToStorage,
    canProceedToNext,
  };

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

// Custom hook
export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error(
      "useConsultation must be used within a ConsultationProvider"
    );
  }
  return context;
}
