import { User } from "../../types"

export const NavbarProfile: React.FC<User> = ({ username }) => {
    return(
        <div>
            {username}
        </div>
    )
}