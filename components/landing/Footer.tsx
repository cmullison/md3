import Link from "next/link";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`${
        theme === "dark"
          ? "bg-royal-900 text-white"
          : "bg-gray-100 text-gray-800"
      } py-12 relative overflow-hidden`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Company Name</h3>
            <p
              className={`${
                theme === "dark" ? "text-royal-200" : "text-gray-600"
              }`}
            >
              Crafting exceptional digital experiences with precision and
              creativity.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About Us", "Services", "Portfolio", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "")}`}
                    className={`${
                      theme === "dark"
                        ? "text-royal-200 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                    } transition-colors`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            {[
              "123 Web Dev Lane",
              "Codeville, IN 12345",
              "Phone: (555) 123-4567",
              "Email: info@companyname.com",
            ].map((item) => (
              <p
                key={item}
                className={`${
                  theme === "dark" ? "text-royal-200" : "text-gray-600"
                }`}
              >
                {item}
              </p>
            ))}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {[FaTwitter, FaLinkedin, FaGithub].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${
                    theme === "dark"
                      ? "text-royal-200 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`mt-8 pt-8 border-t ${
            theme === "dark"
              ? "border-royal-700 text-royal-300"
              : "border-gray-300 text-gray-500"
          } text-center`}
        >
          <p>
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
