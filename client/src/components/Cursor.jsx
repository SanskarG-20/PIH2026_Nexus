import { useRef, useEffect } from "react";

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    const over = (e) => {
      if (e.target.closest("a,button,[data-hover]"))
        ref.current?.classList.add("big");
      else ref.current?.classList.remove("big");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return <div id="cursor" ref={ref} />;
}
