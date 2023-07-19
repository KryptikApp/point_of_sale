import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Menu, { MenuItem } from "./Menu";
import { useThemeContext } from "../ThemeProvider";
import { useAuthContext } from "../AuthProvider";

export default function Navbar() {
  const router = useRouter();
  const { primaryColor } = useThemeContext();
  const { merchant, loading, login } = useAuthContext();

  return (
    <Menu>
      {merchant && merchant.loggedIn && (
        <MenuItem>
          <Link href="../profile">
            <span
              className={`p-2 lg:px-4 md:mx-2 text-gray-400 rounded hover:bg-gray-200 hover:cursor-pointer hover:text-gray-700 dark:hover:bg-gray-300 dark:hover:text-black transition-colors duration-300 ${
                router.pathname == "/profile" ? "font-bold" : ""
              } `}
            >
              Profile
            </span>
          </Link>
        </MenuItem>
      )}
      {merchant && (
        <MenuItem>
          <Link href="../history">
            <span
              className={`p-2 lg:px-4 md:mx-2 text-gray-400 rounded hover:bg-gray-200 hover:cursor-pointer hover:text-gray-700 dark:hover:bg-gray-300 dark:hover:text-black transition-colors duration-300 ${
                router.pathname == "/history" ? "font-bold" : ""
              }`}
            >
              History
            </span>
          </Link>
        </MenuItem>
      )}
      {merchant && (
        <MenuItem>
          <Link href="../receive">
            <span
              className={`p-2 lg:px-4 md:mx-2 text-graay-700 dark:text-white md:text-center md:border md:border-solid border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-white hover:cursor-pointer hover:text-white dark:hover:text-black transition-colors duration-300 mt-1 md:mt-0 md:ml-1`}
            >
              Receive
            </span>
          </Link>
        </MenuItem>
      )}
    </Menu>
  );
}
