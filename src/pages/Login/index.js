import { FcGoogle } from "react-icons/fc";
import { db, auth, provider } from "~/firebase/config";
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function Login() {
    // const [value, setValue] = useState('')

    const handleLogin = async () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                const { user } = data
                const addition = getAdditionalUserInfo(data)

                if (addition?.isNewUser) {
                    try {
                        const docRef = addDoc(collection(db, "users"), {
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            providerId: addition.providerId,
                            createdAt: serverTimestamp()
                        })
                        console.log("Document written with ID: ", docRef);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }
                // setValue(data.user.email)
                // localStorage.setItem('email', data.user.email)
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    // const handleLogout = () => {
    // localStorage.clear()
    // window.location.reload()
    // }

    // useEffect(() => {
    //     setValue(localStorage.getItem('email'))
    // })

    return (
        <section className="w-screen h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đăng nhập để vào phòng học
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tài khoản</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nhập tài khoản..." required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
                                <input type="password" name="password" id="password" placeholder="Nhập mật khẩu..." className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Đăng nhập</button>
                            <div className="text-sm text-white text-center">or</div>
                            <button onClick={handleLogin} type="submit" className="flex justify-center items-center w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <FcGoogle />
                                <span className="mx-1"></span>
                                Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;