import styles from "../styles/Footer.module.scss";
import useWindowSize from "../hooks/WindowSize";

const Footer = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  if (!isDesktop) return null;

  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} HikeWise. All rights reserved</p>
    </footer>
  );
};

export default Footer;
