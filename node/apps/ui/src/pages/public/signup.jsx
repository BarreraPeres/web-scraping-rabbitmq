import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/utils";
import SignUp from "@/forms/signup";
import { useNavigate } from "react-router-dom";

import fetchApi from "@/fetch.api";

function SignUpPage({
    className,
    ...props
}) {
    const navigate = useNavigate()
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Comece Agora!</CardTitle>
                    <CardDescription className="text-zinc-600 -mt-2">
                        Se registre de graça:
                    </CardDescription>
                </CardHeader>
                <CardContent className="-mt-1">
                    <SignUp onSubmit={async (values) => {
                        try {
                            await fetchApi("/auth/signup",
                                "POST",
                                values
                            ).then(res => {
                                if (res.email) {
                                    navigate(
                                        "/playground"
                                    )
                                }
                            })
                        } catch (e) {
                            alert(e.message || e)
                        }

                    }} />
                </CardContent>
            </Card>
        </div>
    );
}
export default SignUpPage;