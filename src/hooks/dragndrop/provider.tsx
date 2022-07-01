import React from 'react'
import DragDropContext from './context';
import { DragDropProviderProps } from './types';

const DragDropProvider: React.FC<DragDropProviderProps> = ({onDragEnd, children}) => {
  return (
    <DragDropContext.Provider value={{onDragEnd}}>
        {children}
    </DragDropContext.Provider>
  )
}

export default DragDropProvider;
