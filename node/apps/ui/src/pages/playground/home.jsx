import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";

export default function PlayGroundHome({
    props
}) {
    const navigate = useNavigate()
    return (
        <div className={cn("flex flex-col gap-6")} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg"></CardTitle>
                    <CardDescription>
                        Home
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-center">
                    <Button onClick={() => navigate("/playground/monitor")}> Monitorar novo produto </Button>
                    <Button> Ver meus protudos </Button>
                    <Button> Explorer </Button>
                </CardContent>
            </Card>
        </div>
    )
}