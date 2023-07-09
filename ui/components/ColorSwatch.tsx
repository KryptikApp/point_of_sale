interface Props {
  color: string;
  clickHandler: (color: string) => any;
}

export default function ColorSwatch(props: Props) {
  const { color, clickHandler } = props;
  return (
    <div
      className="rounded-lg w-6 h-6 hover:scale-110 transition duration-300 ease-in-out transform hover:cursor-pointer my-4"
      style={{ backgroundColor: color }}
      onClick={() => clickHandler(color)}
    ></div>
  );
}
