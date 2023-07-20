import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import cities from "../data/cities";

const CitiesContext = createContext();

const initialState = {
  cities: cities,
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading": {
      return { ...state, isLoading: true };
    }
    case "add": {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    }
    case "delete": {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.position !== action.payload),
        currentCity: {},
      };
    }

    default: {
    }
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function createCity(newCity) {
    dispatch({ type: "loading" });
    dispatch({ type: "add", payload: newCity });
  }

  function deleteCity(position) {
    dispatch({ type: "loading" });
    dispatch({ type: "delete", payload: position });
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
