import React from "react";
import styles from "./Footer.module.css";

type Props = {
  publishedDate: string;
};
const Footer = ({ publishedDate }: Props) => {
  return (
    <footer className={styles.Footer}>
      <div className={styles.Footer_inner}>
        <p>
          이미 진리를 찾아낸 사람은 바보이고, 진리를 찾고 있는 사람은 현자다.{" "}
          <span className={styles.writer}>- 베르나르 베르베르, 타나토노트</span>
        </p>
        <p>
          Contact: <a href="mailto:rockheung@gmail.com">E-mail</a>
        </p>
        <p>Published: {publishedDate}</p>
      </div>
    </footer>
  );
};

export default Footer;
