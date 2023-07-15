import { formatPhoneNumber } from "../utils/phone";

interface Props {
  number: string;
}

export default function PhoneNumberPill({ number }: Props) {
  return (
    <div className="py-1 rounded-md dark:bg-gray-700/30 bg-gray-200/30 w-fit text-2xl">
      {formatPhoneNumber(number)}
    </div>
  );
}
