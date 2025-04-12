import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

function LoginForm({ onSubmit }) {
    const { control, handleSubmit, formState } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
                <h3
                    className="
                -mt-4
                text-md
                font-semibold
                text-center
                "> Dados Pessoais
                </h3>
                <div className="space-y-4">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        autoComplete="email"
                                        id="email"
                                        type="email"
                                        placeholder="m@email.com"
                                        required />
                                )
                            }}
                        />
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center">
                            <Label htmlFor="password">Senha</Label>

                        </div>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        autoComplete="new-password"
                                        id="password"
                                        type="password"
                                        required
                                    />
                                )
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        type="submit"
                        className="w-full">
                        Logar-se
                    </Button>
                </div>
            </div>
            <div className="mt-4 text-center text-sm">
                Não tem uma conta? {" "}
                <a href="/signup" className="underline underline-offset-4">
                    Criar uma conta gratuitamente
                </a>
            </div>
            {formState.errors.email && (
                alert("Por favor, insira um email válido")
            )}
            {formState.errors.password && (
                alert("Por favor, insira uma senha válida")
            )}

        </form>
    )
}
export default LoginForm;