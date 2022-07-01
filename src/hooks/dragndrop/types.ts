import { ReactNode } from "react";

export interface DragDropContextType {
    onDragEnd: (sourceId: string, destinationId: string, data: any) => void;
}

export interface DragDropProviderProps extends DragDropContextType {
    children: ReactNode;
}

export interface DragHookProps {
    canDrag: boolean;
    sourceId: string;
    data: any;
}
