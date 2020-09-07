import React, { useState, useCallback, useMemo, useEffect } from 'react';

const POSITION = { x: 100, y: 200 };

const Draggable = ({ children, id, onDrag }) => {
    const [state, setState] = useState({
        isDragging: false,
        color: "#000",
        origin: POSITION,
        translation: POSITION
    });

    const handleMouseDown = useCallback(({ clientX, clientY }) => {
        setState(state => ({
            ...state,
            isDragging: true,
            origin: { x: clientX - state.translation.x, y: clientY - state.translation.y },
        }));
    }, []);

    const handleMouseMove = useCallback(({ clientX, clientY }) => {
        const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
        // const translation = { x: clientX, y: clientY };
        const color = `rgb(${clientX / 1000 * 255},0,0)`

        setState(state => ({
            ...state,
            color: color,
            translation: translation
        }));

        console.log(state.origin, state.translation, translation, clientX, clientY)
        // onDrag({ translation, id });
    }, [state.origin, , id]);

    const handleMouseUp = useCallback(({ clientX, clientY }) => {
        setState(state => ({
            ...state,
            color: "#ddd",
            isDragging: false,
        }));

        // onDragEnd()
    }, []);

    // const onDragEnd = (({ }) => {
    //     setState(state => ({
    //         ...state,
    //         translation: { x: '1000px', y: '50px' }
    //     }, []))
    // });

    useEffect(() => {
        if (state.isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            // setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
        }
    }, [state.isDragging, handleMouseMove, handleMouseUp]);

    const styles = useMemo(() => ({
        cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
        transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
        transition: state.isDragging ? 'none' : 'transform 500ms',
        zIndex: state.isDragging ? 2 : 1,
        position: 'absolute',
        color: state.color,
        userSelect: 'none'
    }), [state.isDragging, state.translation]);

    return (
        <div style={styles} onMouseDown={handleMouseDown}>
            {children}
        </div>
    );
};

export default function DragTest(props) {



    return (
        <div>
            <Draggable onDrag={console.log} id="uniqueId">
                <h2>Drag me</h2>
            </Draggable>
        </div>
    )
}