import { createContext, useContext } from "react";
import { DragDropContextType } from "./types";

const DragDropContext = createContext<DragDropContextType>({} as DragDropContextType);

export default DragDropContext;

export function useDragDrop() {
    return useContext(DragDropContext);
}
