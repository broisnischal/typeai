import React from "react";
import { useRef } from "react";

export interface ButtonProps {
  time: number;
  children?: React.ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick: setCount, time, children, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    buttonRef?.current?.blur();
    setCount();
  };

  return (
    <button
      className="text-white/90 hover:bg-black/20 px-5 py-2 rounded active:text-green-500"
      {...props}
      onClick={() => handleClick()}
    >
      {time}
      {children}
    </button>
  );
};

export default Button;
