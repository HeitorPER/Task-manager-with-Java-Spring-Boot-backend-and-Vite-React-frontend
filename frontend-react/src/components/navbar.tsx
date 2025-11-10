import LogoIcon from '../assets/catilogo.png'
import { ProfileButton } from './buttons'

// Certifique-se de que este é o único componente 'NavBar' no arquivo.
function NavBar() {
    return (
    <div className="
        w-full
        h-[84px]
        px-4
        #5B5B5
        shadow-md
        flex
        items-center
        justify-between
        ">
        <div className="flex items-center gap-4">
            <img
            src={LogoIcon}
            alt="Logo da Cati"
            className="h-10 w-auto"
            />

            <div className="text-white font-poppins flex flex-col leading-tight">
                <span>cati</span>
                <span>tasks</span>
            </div>

            </div>

            <div className="flex items-center gap-4">
            <ProfileButton />
            </div>

    </div>
    )
}

export default NavBar
