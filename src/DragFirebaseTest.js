import React, { useState, useCallback, useMemo, useEffect } from 'react';
import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from './config';

const POSITION = { x: 100, y: 200 };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const Draggable = ({ children, id, onDrag, initCoord }) => {
  const [state, setState] = useState({
    isDragging: false,
    color: '#000',
    origin: POSITION,
    translation: { x: initCoord.x, y: initCoord.y },
  });
  // console.log(initCoord)

  // const updateFirestore = async () => {
  //     try {
  //         await db
  //             .collection("drag-coord")
  //             .doc('ZxnYzTG5ubO4DRsJMXaG')
  //             .update({
  //                 translation: state.translation
  //             });
  //     }
  //     finally {
  //         console.log('update ok: ', state.translation)
  //     }
  // };

  const updateFirestore = () => {
    db.collection('drag-coord').doc('ZxnYzTG5ubO4DRsJMXaG').update({
      translation: state.translation,
    });
    console.log('update ok: ', state.translation);
  };

  // const fetchFirestore = async () => {
  //     try {

  //     }
  //     finally {
  //         console.log('fetch ok')
  //     }
  // };

  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? 2 : 1,
      position: 'absolute',
      color: state.color,
      userSelect: 'none',
    }),
    [state.color, state.isDragging, state.translation.x, state.translation.y]
  );

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    setState((state) => ({
      ...state,
      isDragging: true,
      origin: {
        x: clientX - state.translation.x,
        y: clientY - state.translation.y,
      },
    }));
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = {
        x: clientX - state.origin.x,
        y: clientY - state.origin.y,
      };
      // const translation = { x: clientX, y: clientY };
      const color = `rgb(${(clientX / 1000) * 255},0,0)`;

      setState((state) => ({
        ...state,
        color,
        translation,
      }));

      // console.log(state.origin, state.translation, translation, clientX, clientY)
      // console.log(...values)
      // onDrag({ translation, id });
      // updateFirestore()
    },
    [state.origin]
  );

  const handleMouseUp = useCallback(() => {
    // const translation = { x: clientX - state.origin.x, y: clientY - state.origin.y };
    setState((state) => ({
      ...state,
      color: '#ddd',
      isDragging: false,
      // translation: translation
    }));

    // onDragEnd()
    // console.log(values[0].translation)
  }, []);

  // const onDragEnd = (({ }) => {
  //     setState(state => ({
  //         ...state,
  //         translation: { x: '1000px', y: '50px' }
  //     }, []))
  // });

  useEffect(() => {
    // fetchFirestore()
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // setState(state => ({ ...state, translation: { x: 0, y: 0 } }));
      // updateFirestore()
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  // useEffect(() => {
  //     const unsubscribe = db
  //         .collection("drag-coord")
  //         .doc('ZxnYzTG5ubO4DRsJMXaG')
  //         .onSnapshot(
  //             function (doc, state) {
  //                 // console.log("Current data: ", doc.data().translation.x);
  //                 setState(state => ({
  //                     ...state,
  //                     translation: state.translation
  //                 }))
  //             });
  //     return unsubscribe
  // }, [state.translation]);

  useEffect(() => {
    const unsubscribe = db
      .collection('drag-coord')
      // .doc('ZxnYzTG5ubO4DRsJMXaG')
      .onSnapshot((snapshots) => {
        console.log('snapshots: ', snapshots);

        snapshots.docChanges().forEach((change) => {
          const data = change.doc.data();
          const changeType = change.type;

          switch (changeType) {
            case 'added':
              // ドキュメントが追加された時の処理
              console.log('add data: ', data);
              updateFirestore();
              break;
            case 'modified':
              // ドキュメントが変更された時の処理
              console.log('modify data: ', data);
              setState((state) => ({
                ...state,
                translation: data.translation,
              }));
              break;
            case 'removed':
              // ドキュメントが削除された時の処理
              break;
            default:
              break;
          }
        });

        // リスナーにより取得した情報を処理
      });

    return () => unsubscribe();
  }, [state.isDragging, state.origin, updateFirestore]);

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
    db.collection('drag-coord'),
    { idField: 'id' }
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{`Error: ${error.message}`}</div>;
  }

  return (
    <div>
      <Draggable id='uniqueId' initCoord={values[0].translation}>
        <h2>Drag me</h2>
      </Draggable>
    </div>
  );
}
