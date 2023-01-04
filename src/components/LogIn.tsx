import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { auth } from "../utils/firebase";

const LogIn: React.FC = () => {

    const {currentUser, setCurrentUser} = useContext(UserContext);

    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true);
    const emailRef = useRef<any>();
    const passwordRef = useRef<any>();
    const passwordConfRef = useRef<any>();
    const [error, setError] = useState<string>("");

    const login = () => {
        auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value).then(() => {
            toast.success("You're signed in!", {duration: 3000});
            setError("");
        }).catch(error => {
            setError("Incorrect email/password");
        });
    }

    const signup = () => {
        if (passwordRef.current.value !== passwordConfRef.current.value) {
            setError("Passwords don't match.");
            return;
        }
        auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then(() => toast.success("You're signed in!", { duration: 3000 }))
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }

    const logout = () => {
        auth.signOut().then(() => toast.success("You're signed out!", {duration: 3000}));
    }

    return (
        <div className="mt-24 absolute w-full flex flex-col items-center">
            <div className="w-11/12 mt-1 flex flex-row items-center">
                <div className="login-line grow" />
                <h2 className='text-3xl text-white font-bold grow-0 px-2'>{currentUser ? "Account" : isLoggingIn ? "Log In" : "Sign Up"}</h2>
                <div className="login-line grow" />
            </div>
            {
                !currentUser ? (
                    <div className="w-full mt-8 max-w-md">
                        <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-2 mx-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input ref={emailRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input ref={passwordRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="**********" />
                            </div>
                            <div className={`${isLoggingIn ? "hidden" : ""}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input ref={passwordConfRef} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="**********" />
                            </div>
                            <small className="text-center text-red-500 mb-2">{error}</small>
                            <div className="flex justify-center items-center mt-2">
                                <button onClick={isLoggingIn ? login : signup} className="bg-blue-500 text-white font-bold py-2 px-4 rounded" type="button">
                                    {isLoggingIn ? "Log In" : "Sign Up"}
                                </button>
                            </div>
                            <small className="flex justify-center items-center mt-3">
                                {isLoggingIn ? "Don't have an account?" : "Already have an account?"}
                                <span onClick={() => {setIsLoggingIn(!isLoggingIn); setError("")}} className="ml-1 cursor-pointer hover:underline text-blue-500">
                                    {isLoggingIn ? "Sign up" : "Log in"}
                                </span>
                            </small>
                        </form>
                    </div>
                ) : (
                    <div className="bg-slate-100 flex justify-between items-center shadow-md rounded w-3/4 mt-4 py-8 px-4">
                        <p>Logged in as: <span className="font-bold">{currentUser.userEmail}</span></p>
                        <button onClick={logout} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Log Out</button>
                    </div>
                )
            }
        </div>
    )
}

export default LogIn;
