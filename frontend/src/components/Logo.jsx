import logoLight from "../assets/rise_fit_logo.png";
import logoDark from "../assets/rise_fit_logo_black.png";

const Logo = ({ classValue = "", theme = "light" }) => {
  const logoSrc = theme === "dark" ? logoDark : logoLight;

  return (
    <div className={`flex justify-left ${classValue}`}>
      <img src={logoSrc} alt="Rise Fit Logo" />
    </div>
  );
}

export default Logo;
