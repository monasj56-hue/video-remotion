import { Composition } from "remotion";
import { Halo } from "./Halo";

export const Root = () => (
  <Composition
    id="Halo"
    component={Halo}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
  />
);
