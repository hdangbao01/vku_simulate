import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from "react-icons/io5";
import { AppContext } from "~/Context/AppProvider";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "~/firebase/config";
import { AuthContext } from "~/Context/AuthProvider";

function Modal() {
    const { openModal, setOpenModal } = useContext(AppContext)
    const { data } = useContext(AuthContext)
    const cancelButtonRef = useRef(null)
    const [name, setName] = useState('')
    const [decs, setDecs] = useState('')

    const handleAddRoom = () => {
        try {
            const docRef = addDoc(collection(db, "rooms"), {
                name: name,
                decs: decs,
                members: [],
                createdAt: serverTimestamp()
            })
            console.log("Document written with ID: ", docRef);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setOpenModal(false)
        setName('')
        setDecs('')
    }

    return (
        <Transition.Root show={openModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-4">
                                    <div className="flex items-start justify-between text-lg">
                                        <div>Thêm phòng</div>
                                        <button onClick={() => setOpenModal(false)}><IoClose /></button>
                                    </div>
                                </div>
                                <div className="bg-white px-4 pt-4">
                                    <div className="flex items-center pb-4">
                                        <p className="mr-4 w-1/4">Tên phòng</p>
                                        <input value={name} onChange={(e) => setName(e.target.value)} className="border w-3/4 border-black rounded-md px-4 py-2" type="text" placeholder="Nhập tên phòng..." />
                                    </div>
                                    <div className="flex items-center pb-4">
                                        <p className="mr-4 w-1/4">Mô tả</p>
                                        <input value={decs} onChange={(e) => setDecs(e.target.value)} className="border w-3/4 border-black rounded-md px-4 py-2" type="text" placeholder="Nhập mô tả..." />
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                                        onClick={handleAddRoom}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setOpenModal(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Modal;