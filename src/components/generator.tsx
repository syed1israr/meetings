import { createAvatar} from "@dicebear/core"
import { initials , botttsNeutral } from "@dicebear/collection"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface props{
    seed : string,
    className?: string,
    variant?: "initials" | "botttsNeutral"
}

export const GenerateAvatar  = ({ seed, className, variant = "initials" }: props) => {
    let avatarSvg;

    if (variant === "initials") {
        avatarSvg = createAvatar(initials, {
            seed,
            fontWeight : 500,
            fontSize : 42
        });
    } else if (variant === "botttsNeutral") {
        avatarSvg = createAvatar(botttsNeutral, {
            seed,
        });
    } else {
        throw new Error("Invalid variant specified");
    }

    return (
        <Avatar className={cn("w-10 h-10", className)}>
            <AvatarImage src={avatarSvg.toDataUri()} alt="Avatar" />
            <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}