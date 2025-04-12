import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

import { useUser } from "../hooks";
import fetchApi from "../fetch.api";


function PlayGroundElementLayout() {
    const { setUser, user } = useUser()
    const navigate = useNavigate()

    const authenticated = useCallback(async () => {
        try {
            const res = await fetchApi("/auth", "GET")
            console.log(res)
            if (!res.user) {
                throw new Error("Forbidden!")
            }
            setUser(res.user)
        } catch (e) {
            alert(e.message || e)
        }
    }, [])
    useEffect(() => {
        authenticated()
    }, [authenticated])


    if (!user) {
        return null
    }

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex p-2 gap-2 max-h-auto max-w-full w-full ">
                    <SidebarTrigger />
                    <div className="flex flex-col mt-1 ml-2 w-full max-w-full">

                        <main className="
                            flex
                            flex-1
                            flex-col
                            p-4
                            -ml-6
                            gap-4
                            min-h-[100vh]
                            rounded-xl 
                            md:min-h-min   
                            max-w-screen-xl
                            mx-auto
                            w-full        
                        ">

                            <Outlet />
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </>
    )
}
export default PlayGroundElementLayout;