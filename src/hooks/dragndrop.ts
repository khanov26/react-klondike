import {useEffect, useRef} from "react";

const getDroppableIdFromPoint = (x: number, y: number) => {
    const elements = document.elementsFromPoint(x, y);

    for (let element of elements) {
        if ((element as HTMLElement).dataset.droppableId) {
            return (element as HTMLElement).dataset.droppableId as string;
        }
    }
    return null;
};

export const useDrop = (droppableId: string) => {

    const droppableProps = {
        'data-droppable-id': droppableId,
    };

    return {droppableProps};
};

export const useDrag = (canDrag: boolean, onDragEnd: (destinationId: string) => void) => {
    const dragRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const dragEl = dragRef.current;
        if (!dragEl) {
            return;
        }

        let mouseShift: [number, number] = [0, 0];

        const onMouseDown = (event: MouseEvent)  => {
            event.stopPropagation();
            if (!canDrag) {
                return;
            }
            document.addEventListener('mousemove', onMouseMove);
            dragEl.addEventListener('mouseup', onMouseUp);
            const {clientX, clientY} = event;
            handleDragStart(clientX, clientY);
        };

        const onTouchStart = (event: TouchEvent) => {
            event.stopPropagation();
            if (!canDrag) {
                return;
            }
            document.addEventListener('touchmove', onTouchMove);
            dragEl.addEventListener('touchend', onTouchEnd);
            const {clientX, clientY} = event.touches[0] || event.changedTouches[0];
            handleDragStart(clientX, clientY);
        };

        const handleDragStart = (clientX: number, clientY: number) => {
            if (dragEl) {
                const {top, left, width} = dragRef.current.getBoundingClientRect();
                mouseShift = [clientX - left, clientY - top];

                dragEl.style.position = 'fixed';
                dragEl.style.top = `${top}px`;
                dragEl.style.left = `${left}px`;
                dragEl.style.width = `${width}px`;
                dragEl.style.zIndex = '100';
            }
        };


        const onMouseMove = (event: MouseEvent) => {
            event.stopPropagation();
            const {clientX, clientY} = event;
            handleDrag(clientX, clientY);
        };

        const onTouchMove = (event: TouchEvent) => {
            event.stopPropagation();
            const {clientX, clientY} = event.touches[0] || event.changedTouches[0];
            handleDrag(clientX, clientY);
        };

        const handleDrag = (clientX: number, clientY: number) => {
            const [shiftX, shiftY] = mouseShift;
            dragEl.style.top = `${clientY - shiftY}px`;
            dragEl.style.left = `${clientX - shiftX}px`;
        };


        const onMouseUp = (event: MouseEvent) => {
            event.stopPropagation();
            document.removeEventListener('mousemove', onMouseMove);
            dragEl.removeEventListener('mouseup', onMouseUp);
            const {clientX, clientY} = event;
            handleDragEnd(clientX, clientY);
        };

        const onTouchEnd = (event: TouchEvent) => {
            event.stopPropagation();
            document.removeEventListener('touchmove', onTouchMove);
            dragEl.removeEventListener('touchend', onTouchEnd);
            const {clientX, clientY} = event.touches[0] || event.changedTouches[0];
            handleDragEnd(clientX, clientY);
        };

        const handleDragEnd = (clientX: number, clientY: number) => {
            mouseShift = [0, 0];
            dragEl.style.position = '';
            dragEl.style.top = '';
            dragEl.style.left = '';
            dragEl.style.width = '';
            dragEl.style.zIndex = '';
            const destinationId = getDroppableIdFromPoint(clientX, clientY);
            if (destinationId) {
                onDragEnd(destinationId);
            }
        };

        dragEl.addEventListener('mousedown', onMouseDown);
        dragEl.addEventListener('touchstart', onTouchStart);

        return () => {
            dragEl.removeEventListener('mousedown', onMouseDown);
            dragEl.removeEventListener('touchstart', onTouchStart);
        };
    }, [canDrag, onDragEnd]);

    return dragRef;
};
