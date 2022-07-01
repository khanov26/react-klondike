export default function useDrop(droppableId: string) {

    const droppableProps = {
        'data-droppable-id': droppableId,
    };

    return {droppableProps};
};
