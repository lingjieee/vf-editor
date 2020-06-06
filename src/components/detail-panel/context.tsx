import {Item} from "@/common/interface";
import React from 'react';

export interface DetailContextProps {
  item?: Item,
  isNode?: boolean,
  isEdge?: boolean,
  isCanvas?: boolean
}

const DetailContext = React.createContext<DetailContextProps>({});

export const DetailContextProvider = DetailContext.Provider;

export function useFlowDetail():DetailContextProps {
  return React.useContext(DetailContext);
}