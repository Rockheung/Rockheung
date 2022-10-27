import React, { useEffect } from "react";
import styles from "./Logo.module.css";

type Color = {
  r: number;
  g: number;
  b: number;
};
const RANDOM_INTENSITY = 18;
const FPS = 10;
const DURATION = 60;
const COLOR_RANGE = 256;
const pick = () => Math.floor(Math.random() * COLOR_RANGE);
const remainder = (m: number, n: number) => (m % n > 0 ? m % n : (m % n) + n);
const offset = (v: number) =>
  Math.floor(
    remainder(v - (Math.random() - 0.7) * RANDOM_INTENSITY, COLOR_RANGE)
  );
const cage = (origin: number, offset: number) => {
  return origin + offset >= COLOR_RANGE || origin + offset < 0
    ? origin - offset
    : origin + offset;
};
// rgb의 각각의 값을 3차원 공간에 0-255 범위의 xyz 공간의 좌표라고 했을때
// 랜덤한 거리의 d를 구해 이 d만큼 움직이는 랜덤한 xyz를 계산하여
// 각각의 값을 다음 rgb로 잡는다.
// 만약 rgb의 범위를 벗어나면 해당 offset을 반전시켜 범위 안쪽으로 계산.
const nextPick = (color: Color): Color => {
  const d = Math.random() * RANDOM_INTENSITY;
  const offsetR = (Math.random() - 0.5) * 2 * d;
  const offsetG = (Math.random() - 0.5) * 2 * Math.sqrt(d ** 2 - offsetR ** 2);
  const offsetB = Math.sqrt(d ** 2 - offsetR ** 2 - offsetG ** 2);

  return {
    r: Math.floor(cage(color.r, offsetR)),
    g: Math.floor(cage(color.g, offsetG)),
    b: Math.floor(cage(color.b, offsetB)),
  };
};

type Props = {
  title: string;
};
const Logo = ({ title }: Props) => {
  const logoRef = React.useRef<HTMLDivElement>(null);
  const [colors, setColors] = React.useState<Color[]>(
    title.split("").map(() => {
      return {
        r: COLOR_RANGE / 2 - 1,
        g: COLOR_RANGE / 2 - 1,
        b: COLOR_RANGE / 2 - 1,
      };
    })
  );

  useEffect(() => {
    let previousTime = 0;
    function updateColor(passedTime: number) {
      if (passedTime - previousTime > 1000 / FPS) {
        setColors((prevColors) => {
          return [
            ...prevColors.slice(1),
            nextPick(prevColors[prevColors.length - 1]),
          ];
        });
        previousTime = passedTime;
      }
      requestAnimationFrame(updateColor);
    }
    const id = requestAnimationFrame(updateColor);
    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  // useEffect(() => {
  //   if (logoRef.current === null || logoRef.current.children.length === 0)
  //     return;

  //   for (let i = 0; i < logoRef.current.children.length; i += 1) {
  //     const { r, g, b } = colors[i];

  //     logoRef.current.children[i].setAttribute(
  //       "style",
  //       `color:rgba(${r},${g},${b},0.8)`
  //     );
  //   }
  // }, [colors]);

  return (
    <div ref={logoRef}>
      {title.split("").map((char, idx) => {
        const { r, g, b } = colors[idx];
        return (
          <span
            key={idx}
            style={{ color: `rgba(${r},${g},${b},0.8)` }}
            className={styles.mouse_interaction}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default Logo;
