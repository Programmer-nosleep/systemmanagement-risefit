import Logo from "../components/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

const FooterLogo = () => {
    return (
        <footer className="bg-gray-800 text-gray-400 text-sm p-6">
            <div className="container mx-auto text-center">
                {/* <Logo /> */}
                <ul className="flex justify-center space-x-6 mb-4">
                    <li><a href="https://risefit.id/" className="hover:text-white">Home</a></li>
                    <li><a href="#" className="hover:text-white">About</a></li>
                    <li><a href="#" className="hover:text-white">Services</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
                <div className="flex justify-center space-x-6 mb-4">
                    <a href="#" className="hover:text-white text-xl"><FontAwesomeIcon icon={faWhatsapp} /></a>
                    <a href="#" className="hover:text-white text-xl"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#" className="hover:text-white text-xl"><FontAwesomeIcon icon={faTiktok} /></a>
                </div>
                <hr className="border-t border-gray-600 my-4" />
                <p>© 2025 System Management. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default FooterLogo;
