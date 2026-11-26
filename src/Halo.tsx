import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Halo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center" }}
    >
      <h1 style={{ color: "white", fontSize: 120, opacity }}>Halo GitHub!</h1>
    </AbsoluteFill>
  );
};
