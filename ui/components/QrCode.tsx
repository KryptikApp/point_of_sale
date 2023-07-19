import QRCodeStyling, { Options } from "qr-code-styling";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  AiFillCheckCircle,
  AiOutlineCopy,
  AiOutlineShareAlt,
} from "react-icons/ai";

// props type
interface QRCodeProps {
  text: string;
  showReadableAddress?: boolean;
  color?: string;
  name?: string;
  pageUrl?: string;
}

export default function QRCode(props: QRCodeProps) {
  const { text, showReadableAddress, color, name, pageUrl } = props;
  const [isCopied, setIsCopied] = useState(false);

  function handleIsCopiedToggle() {
    navigator.clipboard.writeText(text);
    if (!isCopied) {
      // update copy state
      setIsCopied(true);
    }
  }

  useEffect(() => {
    if (!isCopied) return;
    // set copy state to false after 3 seconds
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  function handleSharePage() {
    if (!pageUrl) return;
    // copy page url to clipboard
    navigator.clipboard.writeText(pageUrl);
    const msg = "Copied payment page to clipboard";
    if (color) {
      toast.success(msg, {
        iconTheme: { primary: color, secondary: "#ffffff" },
      });
    } else {
      toast.success(msg);
    }
  }

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

  useEffect(() => {
    // update qr code styling
    const newOptions: Options = {
      ...qrOptions,
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
    };
    setQrOptions(newOptions);
    // update qr code ref styling
    if (qrCode) {
      qrCode.update(newOptions);
    }
  }, [color]);

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
          <p className="font-bold text-gray-900 dark:text-white text-center text-xl">
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
      <div
        className="flex flex-row space-x-2 mx-auto max-w-fit mt-4 hover:cursor-pointer bg-gray-300/20 dark:bg-gray-900/80 rounded-lg p-2"
        onClick={() => handleSharePage()}
      >
        <AiOutlineShareAlt size={20} className="my-auto" />
        <p style={{ color: color }}>Share Payment URL</p>
      </div>
    </div>
  );
}
