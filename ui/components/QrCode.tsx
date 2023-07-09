import QRCodeStyling, { Options } from "qr-code-styling";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { AiFillCheckCircle, AiOutlineCopy } from "react-icons/ai";

// props type
interface QRCodeProps {
  text: string;
  showReadableAddress?: boolean;
  color?: string;
  name?: string;
}

export default function QRCode(props: QRCodeProps) {
  const { text, showReadableAddress, color, name } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [qrOptions, setQrOptions] = useState<Options>({
    width: 300,
    height: 300,
    margin: 1,
    type: "svg",
    data: props.text,
    dotsOptions: {
      gradient: {
        type: "radial",
        colorStops: [
          { offset: 0, color: color ? color : "#18C2F6" },
          { offset: 1, color: "#000000" },
        ],
      },
      type: "dots",
    },
    cornersSquareOptions: {
      color: "black",
      type: "extra-rounded",
    },
    backgroundOptions: {
      color: "#e9ebee",
    },
    imageOptions: {
      crossOrigin: "anonymous",
    },
  });

  const handleIsCopiedToggle = async () => {
    // copy selected adress
    navigator.clipboard.writeText("");
    navigator.clipboard.writeText(text);
    if (!isCopied) {
      // update copy state
      setIsCopied(true);
    }
  };

  const useQRCodeStyling = (options: Options): QRCodeStyling | null => {
    //Only do this on the client
    if (typeof window !== "undefined") {
      /* eslint-disable */
      const QRCodeStylingLib = require("qr-code-styling");
      /* eslint-disable */
      const qrCodeStyling: QRCodeStyling = new QRCodeStylingLib(options);
      return qrCodeStyling;
    }
    return null;
  };

  const [qrCode] = useState<QRCodeStyling | null>(useQRCodeStyling(qrOptions));
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrCode) {
      qrCode.update({ data: text });
    }
  }, []);

  useEffect(() => {
    if (qrRef.current) {
      qrCode?.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  return (
    <div className="max-w-[350px] mx-auto ">
      <div
        className="max-w-[350px] mx-auto min-h-[350px] border rounded-tr-lg rounded-tl-lg"
        style={{ borderColor: color }}
      >
        <div
          ref={qrRef}
          className="min-h-[300px]"
          style={{
            marginLeft: "15px",
            marginRight: "15px",
            marginTop: "10px",
            marginBottom: "10px",
            backgroundColor: color,
            padding: "10px",
            borderRadius: "10px",
          }}
        />
      </div>
      <div
        className="py-2 text-center bg-gray-200 dark:bg-gray-700/70 rounded-br-lg rounded-bl-lg border"
        style={{ borderColor: color }}
      >
        {name && (
          <p className="font-bold text-gray-900 dark:text-white text-center">
            {name}
          </p>
        )}
        {isCopied ? (
          <p
            className="font-bold text-green-600 hover:cursor-pointer "
            onClick={() => handleIsCopiedToggle()}
          >
            <AiFillCheckCircle className="inline mr-3" />
            Copied to Clipboard
          </p>
        ) : (
          <p
            className="hover:cursor-pointer dark:text-white"
            onClick={() => handleIsCopiedToggle()}
          >
            <AiOutlineCopy className="inline mr-3" />
            Copy address to clipboard
          </p>
        )}
      </div>
    </div>
  );
}
