import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeContext } from "../ThemeProvider";
import { useAuthContext } from "../AuthProvider";

type Props = {
  children: any;
};

const Menu: NextPage<Props> = (props) => {
  const [isMenuMobile, setMenuMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { children } = { ...props };
  const { primaryColor } = useThemeContext();
  const { merchant, loading, logout } = useAuthContext();

  // change style based on boolean
  const menuWrapperClassName = isMenuMobile
    ? "flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0 min-h-[80vh] rounded-lg bg-[#F2FBFE] z-10 border-gray-500 border bg-gray-50 py-4 mx-2 pl-4 dark:bg-black md:min-h-0 text-2xl space-y-2"
    : "hidden text-xl md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0";

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (window.innerWidth < 778) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  return (
    <nav
      className={`py-2 md:py-4 mb-4 md:mx-0 px-2 fixed z-20 top-0 w-full ${
        !isMenuMobile && "bg-white/70 dark:bg-black/70"
      } ${isMenuMobile && "bg-white dark:bg-black"}`}
    >
      <div className="md:px-4 mx-auto md:flex md:items-center">
        <div className="flex justify-between items-center hover:cursor-pointer">
          <div onClick={() => setMenuMobile(false)}>
            <Link
              href={
                merchant && merchant.loggedIn && !loading ? "/profile" : "/"
              }
            >
              <span
                className="font-extrabold text-3xl text-gray-900 dark:text-gray-100 hover:dark:text-white hover:text-black transition-colors duration-1500 underline"
                style={{ textDecorationColor: primaryColor }}
              >
                Kryptik Pay
              </span>
            </Link>
          </div>
          <button
            id="nav-icon"
            onClick={() => setMenuMobile(!isMenuMobile)}
            type="button"
            className={`inline-flex ${
              isMenuMobile && "open"
            } items-center mt-2 mr-2 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="bg-gray-500 dark:bg-gray-400"></span>
            <span className="bg-gray-500 dark:bg-gray-400"></span>
            <span className="bg-gray-500 dark:bg-gray-400"></span>
          </button>
        </div>
        <AnimatePresence>
          <motion.div
            id="menu"
            className={menuWrapperClassName}
            onClick={() => setMenuMobile(false)}
            animate={isMenuMobile || !isSmallScreen ? "open" : "closed"}
            variants={{
              closed: {
                scale: 0,
                opacity: 0,
                transition: {
                  type: "spring",
                  duration: 5,
                  delayChildren: 0.2,
                  staggerChildren: 0.05,
                },
              },
              open: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  duration: 0.4,
                  delayChildren: 0.2,
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Menu;

type MenuItemProps = {
  children: any;
};

export function MenuItem(props: MenuItemProps) {
  const { children } = { ...props };
  return (
    <motion.div
      variants={{
        closed: { x: -200, opacity: 0 },
        open: {
          x: 0,
          opacity: 100,
          transition: {
            type: "spring",
            duration: 0.4,
            delayChildren: 0.2,
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
