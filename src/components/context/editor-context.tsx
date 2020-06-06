import {Graph} from "@/common/interface";
import React from "react";
import CommandManager from "@/common/command-manager";

export interface EditorContextProps {
  graph: Graph | null;
  setGraph: (graph: Graph) => void;
  commandManager: CommandManager;
  executeCommand: (name:string, params?:object) => void;
}

const EditorContext = React.createContext<EditorContextProps>({
  graph: null,
  setGraph: ()=>{},
  commandManager: null,
  executeCommand: ()=>{}
});

export const EditorContextProvider = EditorContext.Provider;

export function useEditorContext():EditorContextProps {
  return React.useContext(EditorContext);
}