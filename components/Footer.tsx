import React from "react";
import styles from "./Footer.module.css";

type Props = {
  publishedDate: string;
};
const Footer = ({ publishedDate }: Props) => {
  return (
    <footer className={styles.footer}>
      <p>
        이미 진리를 찾아낸 사람은 바보이고, 진리를 찾고 있는 사람은 현자다.{" "}
        <span className={styles.writer}>- 타나토노트</span>
      </p>
      <a href="mailto:rockheung@gmail.com">Contact: E-mail</a>
      <p>{publishedDate}</p>
    </footer>
  );
};

export default Footer;
