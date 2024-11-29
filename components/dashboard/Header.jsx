import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ModeToggle";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <div className="flex justify-between p-5 shadow-sm items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="flex items-center gap-x-4 ml-auto">
        <ModeToggle />
        <UserButton />
        <MobileNav />
      </div>
    </div>
  );
};

export default Header;
