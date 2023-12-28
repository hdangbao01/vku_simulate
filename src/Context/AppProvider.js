import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "~/hook/useFirestore";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "~/firebase/config";

export const AppContext = createContext()

function AppProvider({ children }) {
    const { data } = useContext(AuthContext)
    const [selectedRoomId, setSelectedRoomId] = useState('')
    const [allRoom, setAllRoom] = useState('')
    const [openModal, setOpenModal] = useState(false)
    // const [headerActive, setHeaderActive] = useState('Trang chủ')

    useEffect(() => {
        const colRef = collection(db, "rooms")
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setAllRoom(data)
        })

        return unsubscribe
    }, [])

    const roomCond = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: data.uid
        }
    }, [data.uid])

    const rooms = useFirestore('rooms', roomCond)

    // const selectedRoom = useMemo(
    //     () => rooms.find(room => room.id === selectedRoomId) || {},
    //     [rooms, selectedRoomId]
    // )

    const selectedRoom = useMemo(
        // eslint-disable-next-line no-mixed-operators
        () => allRoom && allRoom.find(room => room.id === selectedRoomId) || {},
        [allRoom, selectedRoomId]
    )

    const userCond = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        }
    }, [selectedRoom.members])

    const members = useFirestore('users', userCond)

    const dataUserCond = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: '==',
            compareValue: data.uid
        }
    }, [data.uid])

    const dataUser = useFirestore('users', dataUserCond)

    return (
        <AppContext.Provider value={{ rooms, selectedRoomId, setSelectedRoomId, selectedRoom, openModal, setOpenModal, members, allRoom, dataUser }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;