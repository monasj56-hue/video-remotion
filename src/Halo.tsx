import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const DUR = 75;
const WATERMARK = "@namakamu";
const FONT = "Impact, 'Arial Black', sans-serif";

const SCENES = [
  { bg: "#d8b88a", teks: "INI HARI PERTAMA", nama: "", sfx: "pop" },
  { bg: "#c8a373", teks: "DIMAS MULAI BINGUNG", nama: "DIMAS", sfx: "hit" },
  { bg: "#bfae98", teks: "TERUS ADIKNYA IKUTAN", nama: "DEA", sfx: "pop" },
  { bg: "#cfb690", teks: "AKHIRNYA DIA BIKIN BENTENG", nama: "DIMAS", sfx: "ding" },
];

const Mata = ({ left, top, kacamata }: { left: number; top: number; kacamata: boolean }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: kacamata ? 64 : 28,
      height: kacamata ? 64 : 28,
      boxSizing: "border-box",
      borderRadius: "50%",
      border: kacamata ? "8px solid #2a1a10" : "none",
      background: kacamata ? "transparent" : "#2a1a10",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {kacamata ? (
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2a1a10" }} />
    ) : null}
  </div>
);

const Karakter = ({ x, baju, kacamata }: { x: number; baju: string; kacamata: boolean }) => {
  const frame = useCurrentFrame();
  const naik = Math.sin(frame / 5 + x / 100) * 10;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 560,
        width: 240,
        transform: `translateY(${naik}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 240,
          height: 220,
          background: "#b06f3c",
          borderRadius: 24,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -8,
            width: 256,
            height: 80,
            background: "#2a1a10",
            borderRadius: 18,
          }}
        />
        <Mata left={34} top={90} kacamata={kacamata} />
        <Mata left={142} top={90} kacamata={kacamata} />
      </div>
      <div
        style={{
          width: 240,
          height: 260,
          background: baju,
          borderRadius: 24,
          marginTop: 10,
        }}
      />
    </div>
  );
};

const Scene = ({
  bg,
  teks,
  nama,
  index,
}: {
  bg: string;
  teks: string;
  nama: string;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, DUR], [1, 1.08]);
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const pop = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: fade }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 600,
            background: "#9a7a52",
          }}
        />
        <Karakter x={160 + index * 20} baju="#e8e2d4" kacamata={true} />
        <Karakter x={640 - index * 30} baju="#d9772b" kacamata={false} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,35,10,0.45) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 70,
          left: 60,
          color: "white",
          opacity: 0.6,
          fontSize: 44,
          fontFamily: FONT,
        }}
      >
        {WATERMARK}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 300,
          textAlign: "center",
          opacity: frame >= 8 ? 1 : 0,
          transform: `scale(${0.6 + 0.4 * pop})`,
        }}
      >
        {nama ? (
          <div>
            <div
              style={{
                display: "inline-block",
                background: "#ffd600",
                color: "#111",
                fontSize: 38,
                fontWeight: 900,
                padding: "6px 22px",
                borderRadius: 10,
                marginBottom: 14,
                fontFamily: FONT,
              }}
            >
              {nama}
            </div>
          </div>
        ) : null}
        <div
          style={{
            color: "white",
            fontSize: 96,
            fontWeight: 900,
            fontFamily: FONT,
            padding: "0 60px",
            textShadow: "0 6px 0 #000, 0 0 18px rgba(0,0,0,0.8)",
            WebkitTextStroke: "4px black",
            paintOrder: "stroke fill",
          }}
        >
          {teks}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Halo = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {SCENES.map((s, i) => (
      <Sequence key={"scene" + i} from={i * DUR} durationInFrames={DUR}>
        <Scene bg={s.bg} teks={s.teks} nama={s.nama} index={i} />
      </Sequence>
    ))}
    {SCENES.map((s, i) => (
      <Sequence key={"w" + i} from={Math.max(0, i * DUR - 3)} layout="none">
        <Audio src={staticFile("whoosh.wav")} volume={0.7} />
      </Sequence>
    ))}
    {SCENES.map((s, i) => (
      <Sequence key={"s" + i} from={i * DUR + 8} layout="none">
        <Audio src={staticFile(s.sfx + ".wav")} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
