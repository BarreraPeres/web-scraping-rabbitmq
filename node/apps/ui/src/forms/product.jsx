import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const productForm = z.object({
    url: z.string().url()
})

function ProductForm({ onSubmit }) {
    const { control, handleSubmit, formState } = useForm({
        resolver: zodResolver(productForm),
        defaultValues: {
            url: "",
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">

                <div className="space-y-4">
                    <div className="grid gap-3">
                        <Label htmlFor="url">URL</Label>
                        <Controller
                            control={control}
                            name="url"
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        autoComplete="text"
                                        id="url"
                                        type="text"
                                        placeholder="https://www.amazon.com.br/produto-exemplo"
                                        required />
                                )
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        type="submit"
                        className="w-full">
                        Cadastrar Produto
                    </Button>
                </div>
            </div>
            {/* <div className="mt-4 text-center text-sm">
                Não tem uma conta? {" "}
                <a href="/signup" className="underline underline-offset-4">
                    Criar uma conta gratuitamente
                </a>
            </div> */}
            {formState.errors.url && (
                alert("Por favor, insira uma ULR válida, por enquanto só aceitamos AMAZON")
            )}
        </form>
    )
}
export default ProductForm;