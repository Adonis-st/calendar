import { useState, useEffect } from "react";

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(true); // Start with true to avoid hydration issues

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return isDesktop;
}
