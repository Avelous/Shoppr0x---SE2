// Components
import { Rating } from "./Rating";
import { LoadingOutlined } from "@ant-design/icons";
import { ethers } from "ethers";

interface SectionProps {
  title: any;
  items: any;
  togglePop: (item: any) => void;
}

export const Section = ({ title, items, togglePop }: SectionProps) => {
  return (
    <>
      {!items ? (
        <div className="p-20 flex justify-center items-center text-2xl">
          <LoadingOutlined />
        </div>
      ) : (
        <div
          className=""
          style={{
            maxWidth: "1200px",
            margin: "0 auto 50px",
            padding: "0 20px",
          }}
        >
          <h3 id={title} className="font-semibold">
            {title}
          </h3>

          <hr />

          <div className="grid md:grid-cols-3 grid-cols-2 text-sm mt-5 justify-start">
            {items.map((item: any, index: number) => (
              <div className="w-5/6 hover:shadow-xl cursor-pointer" key={index} onClick={() => togglePop(item)}>
                <div>
                  <img src={item.image} alt="Item" />
                </div>
                <div className="px-2 mt-3">
                  <h4>{item.name}</h4>
                  <Rating value={item.rating} />
                  <p className="mt-2">{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
