import { useState } from "react";

// props type
interface Props {
  onDone: (address: string) => any;
  placeholder: string;
  color: string;
}

export default function InputText(props: Props) {
  const { onDone, placeholder, color } = props;
  const [address, setAddress] = useState("");

  function handleSubmit() {
    onDone(address);
  }

  return (
    <div className="relative my-4 rounded-lg">
      <input
        type="search"
        id="search"
        className="block w-full p-4 pl-4 dark:ring-gray-600 ring-2 ring-gray-300 text-2xl text-gray-900 rounded-lg bg-transparent dark:bg-transparent dark:placeholder-gray-400 dark:text-white focus:outline-none focus:outline-4"
        placeholder={placeholder}
        style={{ outlineColor: color }}
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        type="submit"
        className="text-white absolute right-0 bottom-0 top-0 font-medium rounded-tr-lg rounded-br-lg text-xl px-4 py-2 my-[2px] mr-[2px]"
        style={{ backgroundColor: color, opacity: 0.99 }}
        onClick={handleSubmit}
      >
        Done
      </button>
    </div>
  );
}
