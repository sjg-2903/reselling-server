import React, { useState } from 'react';
import { AiOutlineSetting, AiOutlineLogout, AiOutlineDown } from 'react-icons/ai';
import { FaImages, FaIndustry, FaChartLine, FaTicketAlt, FaNewspaper, FaHome, FaAmazon } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { ImNewspaper } from "react-icons/im";
import { MdOutlineLocalOffer } from "react-icons/md";
import { PiLego } from "react-icons/pi";
import './Sidebar.css'; // Import custom CSS for sidebar styling
import logo from '../../../LoginAssets/logo.png';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(''); // State to manage active link
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false); // State to manage news dropdown
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isOffersDropdownOpen, setIsOffersDropdownOpen] = useState(false); // State to manage home dropdown
  const navigate = useNavigate();

  const handleClick = (linkName, navigateTo) => {
    if (activeLink !== linkName) {
      setActiveLink(linkName);
      if (navigateTo) {
        navigate(navigateTo);
      }
    }
  };

  const toggleNewsDropdown = () => {
    setIsNewsDropdownOpen(!isNewsDropdownOpen);
  };

  const toggleHomeDropdown = () => {
    setIsHomeDropdownOpen(!isHomeDropdownOpen);
  };

  const toggleOffersDropdown = () => {
    setIsOffersDropdownOpen(!isOffersDropdownOpen);
  };

  return (
    <div className="sidebar">
      {/* Sidebar logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Sidebar links */}
      <ul className="sidebar-links">
        <li 
          className={`sidebar-link ${activeLink === 'Home' ? 'active' : ''}`}
          onClick={toggleHomeDropdown}
        >
          <FaHome className="sidebar-icon" />
          <span className="link-text">Home Section</span>
          <IoIosArrowDropdown className="dropdown-arrow" />
        </li>
        {isHomeDropdownOpen && (
          <ul className="dropdown-menu">
            <li 
              className={`sidebar-link ${activeLink === 'AddBanner' ? 'active' : ''}`}
              onClick={() => handleClick('AddBanner', '/dashboard')}
            >
              <FaImages className="sidebar-icon" />
              <span className="link-text">Add Banner</span>
            </li>
            <li 
              className={`sidebar-link ${activeLink === 'AddCompany' ? 'active' : ''}`}
              onClick={() => handleClick('AddCompany', '/company')}
            >
              <FaIndustry className="sidebar-icon" />
              <span className="link-text">Add Company</span>
            </li>
            <li 
              className={`sidebar-link ${activeLink === 'AddSegment' ? 'active' : ''}`}
              onClick={() => handleClick('AddSegment', '/segment')}
            >
              <RiCoupon2Fill className="sidebar-icon" />
              <span className="link-text">Add Segment</span>
            </li>
          </ul>
        )}
        <li 
          className={`sidebar-link ${activeLink === 'News' ? 'active' : ''}`}
          onClick={toggleNewsDropdown}
        >
          <ImNewspaper className="sidebar-icon" />
          <span className="link-text">News Section</span>
          <IoIosArrowDropdown className="dropdown-arrow" />
        </li>
        {isNewsDropdownOpen && (
          <ul className="dropdown-menu">
            <li 
              className={`sidebar-link ${activeLink === 'AddNews' ? 'active' : ''}`}
              onClick={() => handleClick('AddNews', '/news')}
            >
              <FaNewspaper className="sidebar-icon" />
              <span className="link-text">Add News</span>
            </li>
            <li 
              className={`sidebar-link ${activeLink === 'AddAnalytics' ? 'active' : ''}`}
              onClick={() => handleClick('AddAnalytics', '/analytics')}
            >
              <FaChartLine className="sidebar-icon" />
              <span className="link-text">Add Analytics</span>
            </li>
            <li 
              className={`sidebar-link ${activeLink === 'AddCoupons' ? 'active' : ''}`}
              onClick={() => handleClick('AddCoupons', '/coupons')}
            >
              <FaTicketAlt className="sidebar-icon" />
              <span className="link-text">Add Coupons</span>
            </li>
          </ul>
        )}
        <li 
          className={`sidebar-link ${activeLink === 'Logout' ? 'active' : ''}`}
          onClick={() => handleClick('OffersSection', '/lego')}
        >
          <MdOutlineLocalOffer className="sidebar-icon" />
          <span className="link-text">Offer Section</span>
        </li>
        
        
        <li 
          className={`sidebar-link ${activeLink === 'Logout' ? 'active' : ''}`}
          onClick={() => handleClick('Logout', '/')}
        >
          <AiOutlineLogout className="sidebar-icon" />
          <span className="link-text">Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

