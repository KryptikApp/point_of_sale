import { Underdog } from "next/font/google";

interface VerticalSpaceProps {
  size?: number;
}
const defaultSize = 15;
export default function VerticalSpace(props: VerticalSpaceProps) {
  let { size } = { ...props };
  if (size == null || size == undefined) size = defaultSize;
  return <div style={{ minHeight: `${size}vh` }}></div>;
}
