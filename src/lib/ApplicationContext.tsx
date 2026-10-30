import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type UserProps = {
    name?: string,
    surname?: string,
    
}

type ApplicationContextProps = {
    isAuthenticated: boolean 
    user?: UserProps,
    setUser: (user : UserProps) => void;
}
const context = createContext<ApplicationContextProps>({ isAuthenticated: false, setUser: () => {}}) 

export default function ApplicationContextProvider({children} : {children : ReactNode}) {
      const [authenticated, setAuthenticatedState] = useState<boolean>(false);
      const [user, setUserState] = useState<UserProps>()
      const setUser = (user : UserProps) => {
        setUserState(user);
        useEffect(() => {
            setAuthenticatedState(user !== null || user !== undefined)
        }, [user])


      }

      return <context.Provider value={{isAuthenticated: authenticated, user: user, setUser}}>{children}</context.Provider>

}

export const useApplicationContext = () => useContext(context)