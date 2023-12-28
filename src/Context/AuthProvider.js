import { auth, dt } from "~/firebase/config";
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { createContext, useEffect, useState } from "react";
import Load from "~/components/Load";

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (data) => {
            if (data) {
                const { displayName, email, uid, photoURL } = data
                setData({ displayName, email, uid, photoURL })
                navigate('/meeting')
                setIsLoading(false);
                return
            } else {
                setIsLoading(false)
                navigate('/login?email=&password=')
            }
        })

        return () => unsub()
    }, [navigate])

    console.log(dt);

    return (
        <AuthContext.Provider value={{ data }}>
            {/* {isLoading ? <Load /> : children} */}
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;