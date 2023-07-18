import toast from "react-hot-toast";
import { useThemeContext } from "./ThemeProvider";
import { useAuthContext } from "./AuthProvider";
import { trimPrincipal } from "../utils/identity";

export default function IdPill() {
  const { merchant } = useAuthContext();
  const { primaryColor } = useThemeContext();
  const handleCopy = () => {
    navigator.clipboard.writeText(merchant?.id || "");
    toast.success("ID copied to clipboard.");
  };
  return (
    <div
      className="opacity-20 hover:opacity-100 rounded-lg border w-fit"
      style={{ borderColor: primaryColor }}
    >
      <div
        className="flex flex-row space-x-2 px-2 py-1 rounded-lg dark:bg-gray-700/60 bg-gray-200/60 hover:cursor-pointer text-2xl w-fit hover:text-green-400"
        onClick={() => handleCopy()}
      >
        {trimPrincipal(merchant?.id || "")}
      </div>
    </div>
  );
}
