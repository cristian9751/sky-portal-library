import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

export type UserProps = {
    name?: string;
    surname?: string;
    profileLink: {
        onClick: () => void
    };
    avatar?: string;
    role: string;
    memberSince: string;
    stats: { href: string; label: string }[];
};

// El usuario que se pasa a setUser puede omitir stats y memberSince
export type SetUserInput = Omit<UserProps, "stats" | "memberSince"> &
    Partial<Pick<UserProps, "stats" | "memberSince">>;

type ApplicationContextProps = {
    isAuthenticated: boolean;
    user?: UserProps;
    setUser: (user: SetUserInput) => void;
    clearUser: () => void;
    onLogout: () => void | Promise<void>;
};

const context = createContext<ApplicationContextProps>({
    isAuthenticated: false,
    setUser: () => {},
    clearUser: () => {},
    onLogout: () => {},
});

type ApplicationContextProviderProps = {
    children: ReactNode;
    onLogout?: (user?: UserProps) => void | Promise<void>;
};

export default function ApplicationContextProvider({
    children,
    onLogout: onLogoutCallback,
}: ApplicationContextProviderProps) {
    const [user, setUserState] = useState<UserProps>();

    const setUser = useCallback((input: SetUserInput) => {
        // Se crea un objeto nuevo en vez de mutar el recibido
        setUserState({
            ...input,
            memberSince: input.memberSince ?? "",
            stats: input.stats ?? [],
        });
    }, []);

    const clearUser = useCallback(() => setUserState(undefined), []);

    const onLogout = useCallback(
        () =>  {
            return onLogoutCallback?.(user) 
        },
        [onLogoutCallback, user]
    );

    const value = useMemo(
        () => ({
            isAuthenticated: user !== undefined,
            user,
            setUser,
            clearUser,
            onLogout,
        }),
        [user, setUser, clearUser, onLogout]
    );

    return <context.Provider value={value}>{children}</context.Provider>;
}

export const useApplicationContext = () => useContext(context);