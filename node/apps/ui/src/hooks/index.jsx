import useUser, { UserProvider } from "./use-user";

export { useUser };

export function Provider({ children }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    )
}