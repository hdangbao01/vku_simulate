import { useEffect, useState } from "react";
import { db } from "~/firebase/config";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore"

function useFirestore(col, cond) {
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        let colRef = collection(db, col)

        if (cond) {
            if (!cond.compareValue || !cond.compareValue.length) {
                return
            }
            colRef = query(colRef, where(cond.fieldName, cond.operator, cond.compareValue), orderBy("createdAt"))
        }

        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))

            setDocuments(data)
        })

        return unsubscribe
    }, [col, cond])

    return documents
}

export default useFirestore;