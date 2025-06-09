import React from "react";

export interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: "portrait" | "landscape";
  screenSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  viewportWidth: number;
  viewportHeight: number;
}

export const useMobile = (): MobileDetection => {
  const [detection, setDetection] = React.useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    orientation: "landscape",
    screenSize: "lg",
    viewportWidth: 1024,
    viewportHeight: 768,
  });

  React.useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Breakpoint detection
      let screenSize: MobileDetection["screenSize"] = "xs";
      if (width >= 1536) screenSize = "2xl";
      else if (width >= 1280) screenSize = "xl";
      else if (width >= 1024) screenSize = "lg";
      else if (width >= 768) screenSize = "md";
      else if (width >= 640) screenSize = "sm";

      // Device type detection
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Orientation detection
      const orientation = height > width ? "portrait" : "landscape";

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        orientation,
        screenSize,
        viewportWidth: width,
        viewportHeight: height,
      });
    };

    // Initial detection
    updateDetection();

    // Listen for viewport changes
    window.addEventListener("resize", updateDetection);
    window.addEventListener("orientationchange", updateDetection);

    return () => {
      window.removeEventListener("resize", updateDetection);
      window.removeEventListener("orientationchange", updateDetection);
    };
  }, []);

  return detection;
};
