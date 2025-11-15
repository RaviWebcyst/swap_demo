import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import "./TickerSlider.scss";
import { useEffect, useState } from "react";

// const tickers = [
//   {
//     icon: "ticker-slider/Bitcoin.png",
//     name: "BTC",
//     value: "+2.34%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Ethereum.png",
//     name: "ETH",
//     value: "-1.45%",
//     color: "red",
//   },
//   {
//     icon: "ticker-slider/Tether.png",
//     name: "SOL",
//     value: "+0.98%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Bitcoin.png",
//     name: "BTC",
//     value: "+2.34%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Ethereum.png",
//     name: "ETH",
//     value: "-1.45%",
//     color: "red",
//   },
//   {
//     icon: "ticker-slider/Tether.png",
//     name: "SOL",
//     value: "+0.98%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Ethereum.png",
//     name: "ETH",
//     value: "-1.45%",
//     color: "red",
//   },
//   {
//     icon: "ticker-slider/Tether.png",
//     name: "SOL",
//     value: "+0.98%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Bitcoin.png",
//     name: "BTC",
//     value: "+2.34%",
//     color: "green",
//   },
//   {
//     icon: "ticker-slider/Ethereum.png",
//     name: "ETH",
//     value: "-1.45%",
//     color: "red",
//   },
//   {
//     icon: "ticker-slider/Tether.png",
//     name: "SOL",
//     value: "+0.98%",
//     color: "green",
//   },
// ];

const TickerSlider = () => {
  const [tickers, setTickers] = useState([]);
  console.log("tickers->", tickers);
  
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/coin/list`
        );
        const data = await response.json();
        console.log("tiker:", data);

        if (data.status === 200 && !data.error) {
          // Assuming the data format is like the static tickers array
          const fetchedTickers = data.data.map((coin) => ({
            icon: coin.logo, // Assuming the image names are based on the coin symbol
            name: coin.name,
            symbol: coin.symbol,
            value: `${coin.percentChange24h}%`, // Replace 'priceChange' with the actual key from the API response
            color: coin.percentChange24h >= 0 ? "positive" : "negative", // Simple logic to determine color
          }));

          setTickers(fetchedTickers);
        } else {
          console.error("Error fetching data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching tickers:", error);
      }
    };

    fetchTickers();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 1, delay: 0.5 }, // Adding delay for opacity
      }}
      className="ticker-slider"
    >
      <Marquee>
        {tickers?.map((ticker, index) => (
          <div
            className="ticker-card"
            // initial={{ translateX: "0" }}
            // animate={{ translateX: "50%" }}
            // transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <img
              src={ticker.icon}
              alt={ticker.name}
              className="ticker-card__icon"
            />
            <div className="ticker-card__content">
              <span className="symbol">{ticker.symbol}</span>
              <span className="name text-uppercase">{ticker.name}</span>
            </div>
            <span className={`ticker-card__value ticker-card__value--${ticker.color}`}>
              {ticker.value}
            </span>
          </div>
        ))}
      </Marquee>
    </motion.div>
  );
};

export default TickerSlider;
