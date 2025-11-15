import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Carousel } from "react-bootstrap";
import "./Carousel.scss";

const CustomCarousel = () => {
  // const [index, setIndex] = useState<number>(0);

  const carouselItems = [
    {
      image: "carousel/banner_1.png",
      title: "RezorPro",
      description: "Your all-in-one crypto platform",
    },
    {
      image: "carousel/banner_2.png",
      title: "RezorCard",
      description: "Your crypto Visa debit card",
    },
    // {
    //   image: "carousel/banner_3.png",
    //   title: "XBridge",
    //   description: "Cross-chain bridging made easy",
    // },
    // {
    //   image: "carousel/banner_1.png",
    //   title: "RezorPro",
    //   description: "Your all-in-one crypto platform",
    // },
    // {
    //   image: "carousel/banner_2.png",
    //   title: "RezorCard",
    //   description: "Your crypto Visa debit card",
    // },
    {
      image: "carousel/banner_3.png",
      title: "XBridge",
      description: "Cross-chain bridging made easy",
    },
    {
      image: "carousel/banner_4.png",
      title: "RezorSwap",
      description: "Trade and earn with RezorSwap",
    },
  ];

  // const handleSelect = (selectedIndex: number, e: any) => {
  //   setIndex(selectedIndex);
  // };

  // Determine which three items to show
  // const visibleItems = carouselItems.slice(index, index + 3);
  // if (visibleItems.length < 3) {
  //   visibleItems.push(...carouselItems.slice(0, 3 - visibleItems.length));
  // }

  return (
    <motion.div
      className="flex-container"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 1, delay: 0.5 }, // Adding delay for opacity
      }}
    >
      {carouselItems.map((item) => (
        <div className="d-sm-block d-none">
          <div className="flex-item">
            <img src={item.image} alt={item.title} />
          </div>
        </div>
      ))}
      <div className="d-sm-none">
        <Carousel controls={false} indicators={false}>
          {carouselItems.map((item) => (
            <Carousel.Item>
              <div className="flex-item">
                <img src={item.image} alt={item.title} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </motion.div>
  );
};

export default CustomCarousel;
