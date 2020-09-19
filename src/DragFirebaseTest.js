import React, { useState, useCallback, useMemo, useEffect } from 'react';
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firebaseConfig } from './config';

const POSITION = { x: 100, y: 200 };

firebase.initializeApp(firebaseConfig);

const Draggable = ({ children, id, onDrag, initCoord }) => {
    const [state, setState] = useState({
        isDragging: false,
        color: "#000",
        origin: POSITION,
        translation: { x: initCoord.x, y: initCoord.y }
    });
    console.log(initCoord)

    const updateFirestore = async () => {
        try {
            await firebase
                .firestore()
                .collection("drag-coord")
                .doc('ZxnYzTG5ubO4DRsJMXaG')
                .update({
                    translation: state.translation
                });
        }
        finally {
            console.log('ok')
        }
    };

    const styles = useMemo(() => ({
        cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
        transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
        transition: state.isDragging ? 'none' : 'transform 500ms',
        zIndex: state.isDragging ? 2 : 1,
        position: 'absolute',
        color: state.color,
        userSelect: 'none'
    }), [state.isDragging, state.translation]);

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


        // console.log(state.origin, state.translation, translation, clientX, clientY)
        // console.log(...values)
        // onDrag({ translation, id });
        // updateFirestore()
    }, [state.origin, id]);

    const handleMouseUp = useCallback(({ clientX, clientY }) => {
        const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
        setState(state => ({
            ...state,
            color: "#ddd",
            isDragging: false,
            translation: translation
        }));

        // onDragEnd()
        // console.log(values[0].translation)
    }, [state.origin, state.translation]);

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
            updateFirestore()
        }
    }, [state.isDragging, handleMouseMove, handleMouseUp]);

    // const [values, loading, error] = useCollectionData(
    //     firebase.firestore().collection("drag-coord"),
    //     { idField: "id" }
    // );
    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    // if (error) {
    //     return <div>{`Error: ${error.message}`}</div>;
    // }


    return (
        <div style={styles} onMouseDown={handleMouseDown}>
            {children}
        </div>
        // <ul>
        //     {values.map(value => (
        //         <li>{value.origin.x}</li>
        //     ))}
        // </ul>
    );
};

export default function DragTest(props) {

    const [values, loading, error] = useCollectionData(
        firebase.firestore().collection("drag-coord"),
        { idField: "id" }
    );
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{`Error: ${error.message}`}</div>;
    }

    return (
        <div>
            <Draggable id="uniqueId" initCoord={values[0].translation}>
                <h2>Drag me</h2>
            </Draggable>
        </div>
    )
}