import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import fetchApi from "@/fetch.api";
import LoginForm from "@/forms/login";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";

function LoginPage({
    className,
    ...props
}) {
    const navigate = useNavigate()
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Acesse Sua Conta</CardTitle>
                    <CardDescription>
                        Insira seu e-mail abaixo para fazer login em sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onSubmit={async (values) => {
                        try {
                            await fetchApi("/auth/login",
                                "POST",
                                values
                            ).then(res => {
                                if (res.email) {
                                    navigate("/playground")
                                }
                            })
                        } catch (e) {
                            alert(e.message || e)
                        }
                    }}>

                    </LoginForm>
                </CardContent>
            </Card>
        </div>
    );
}
export default LoginPage;