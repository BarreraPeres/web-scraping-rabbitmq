import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
})

function SignUp({ onSubmit }) {
    const { control, handleSubmit, formState } = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
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
                        <Label htmlFor="name">Seu Nome</Label>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id="name"
                                        type="text"
                                        placeholder="Carlos Villagrán"
                                        required />
                                )
                            }}
                        />
                    </div>
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
                        Cadastrar-se gratuitamente
                    </Button>
                </div>
            </div>
            <div className="mt-4 text-center text-sm">
                Já tem uma conta? {" "}
                <a href="/login" className="underline underline-offset-4">
                    Entrar
                </a>
            </div>
            {formState.errors.email && (
                alert("Por favor, insira um email válido")
            )}
            {formState.errors.name && (
                alert("Por favor, insira um nome válido")
            )}
            {formState.errors.password && (
                alert("Por favor, insira uma senha válida")
            )}

        </form>
    )
}
export default SignUp;