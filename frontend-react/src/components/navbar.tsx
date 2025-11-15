import LogoIcon from '../assets/catilogo.png'
import { ProfileButton, NotificationButton} from './buttons'

function NavBar() {
    return (
    <div className="
        w-full
        h-[84px]
        px-20
        py-3
        shadow-md
        flex
        items-center
        justify-between
        font-family-poppins
        bg-linear-to-b from-[#1f1f1f] to-[#363636]


        ">
        <div className="flex items-center gap-4">
            <img
            src={LogoIcon}
            alt="Logo da Cati"
            className="h-10 w-auto"
            />

            <div className="text-white flex flex-col leading-tight">
                <span>cati</span>
                <span>tasks</span>
            </div>

            </div>

            <div className="flex items-center gap-3">
            <NotificationButton/>
            <ProfileButton />
            </div>

    </div>
    )
}

export default NavBar
