import React from "react";
import Lottie from "lottie-react";
// import glowbg from "../../../assets/animations/glow_bg.json";
import glowbg from "../../../assets/animations/glow_bg.json";
import "./Social.scss";
import {
  Facebook,
  Instagram,
  Linkedin,
  Telegram,
  Twitter,
} from "../../../assets/icons/svgicons";
import { motion } from "framer-motion";

const Social = () => {
  return (
    <motion.div
      className="community-layout"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 1, delay: 0.5 }, // Adding delay for opacity
      }}
    >
      <motion.div
        className="text-section"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>EMPOWERED BY COMMUNITY</h2>
        <p>
          Products are powered by the RezorChain Protocol. The protocol is the
          largest onchain marketplace, with billions of dollars in weekly.
        </p>
        <h4>Get social with us!</h4>
        <div className="social-icons">
          <a
            href="https://x.com/RezorChainCoin?t=a3CEIVO0BUl093GQo6Lqjw&s=08"
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security reasons
          >
            <Twitter />
          </a>
          <a
          href="https://t.me/RezormaWorldwide"
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security reasons
          >
          <Telegram />
          </a>
          <a
            href="https://www.linkedin.com/company/rezorchain/"
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security reasons
          >
            <Linkedin />
          </a>
          <a
            href="https://www.instagram.com/rezorchaincoin/"
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security reasons
          >
            <Instagram />
          </a>
          <a
            href="https://www.facebook.com/groups/wearerezorma/?ref=share&mibextid=NSMWBT"
            target="_blank" // Opens the link in a new tab
            rel="noopener noreferrer" // Security reasons
          >
            <Facebook />
          </a>
        </div>
      </motion.div>
      <motion.div
        className="image-section"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* <div className="glow-bg">
          <Lottie animationData={glowbg} loop={true} />
        </div> */}
        {/* <video autoPlay loop muted>
          <source
            src="https://rezordex-deepak.s3.us-east-2.amazonaws.com/Videos/2glow_bg.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video> */}
        <img src="home/social/SocialMediaMain.png" alt="Social Media Icons" />
      </motion.div>
    </motion.div>
  );
};

export default Social;
