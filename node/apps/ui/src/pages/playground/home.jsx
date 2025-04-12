import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import fetchApi from "@/fetch.api";
import ProductForm from "@/forms/product";
import { useUser } from "@/hooks";
import { cn } from "@/utils";

export default function PlayGroundHome({
    props
}) {
    const { user } = useUser()

    return (
        <div className={cn("flex flex-col gap-6")} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg"></CardTitle>
                    <CardDescription>
                        Observe o valor de seu produto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm onSubmit={(values) => {
                        try {
                            fetchApi(
                                "/v1/prices",
                                "GET", {
                                url: values.url,
                                email: user.email
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }}>

                    </ProductForm>
                </CardContent>
            </Card>
        </div>
    )
}