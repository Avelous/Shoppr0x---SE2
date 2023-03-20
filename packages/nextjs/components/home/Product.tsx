import { useEffect, useState } from "react";
import Image from "next/image";
// Components
import { Rating } from "./Rating";
import close from "./assets/close.svg";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { notification } from "~~/utils/scaffold-eth";

interface item {
  id: number;
  cost: any;
  image: any;
  name: any;
  rating: any;
  stock: any;
  description: any;
  address: any;
}

interface ProductProps {
  item: item; // replace 'any' with the type of your item object
  account: any;
  shoppr0x: any;
  abi: any; // replace 'any' with the type of your abi object
  togglePop: (item: any) => void;
}

export const Product = ({ item, account, shoppr0x, abi, togglePop }: ProductProps) => {
  const [order, setOrder] = useState<any>(null);
  const [hasBought, setHasBought] = useState<any>(false);

  const fetchDetails = async () => {
    const events: any = await shoppr0x.queryFilter("Buy");
    const orders = events.filter(
      (event: any) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString(),
    );

    if (orders.length === 0) return;

    const order = await shoppr0x.orders(account, orders[0].args.orderId);
    setOrder(order);
  };

  const buyHandler = async () => {
    try {
      const config = await prepareWriteContract({
        address: shoppr0x.address,
        abi: abi,
        functionName: "buy",
        args: [item.id],
        overrides: {
          value: item.cost,
        },
      });
      const transaction = await writeContract(config);

      await transaction.wait();

      setHasBought(true);
      notification.success(<p className="mt-0 mb-1gi">Succussful bought {item.name} </p>);
    } catch (error) {
      notification.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [hasBought]);

  return (
    <div className="w-screen h-screen fixed top-0 text-sm bg-black bg-opacity-60 left-0 z-20 flex justify-center">
      <div className="sm:w-5/6  h-5/6 w-11/12 pb-5 sm:mt-20 mt-10 bg-base-200 rounded-sm flex flex-wrap gap-4 items-center sm:justify-center absolute sm:overflow-hidden overflow-y-scroll">
        <div className="lg:w-1/4 sm:w-1/3 px-4 sm:mt-0 mt-5 lg:h-4/5 py-4">
          <img src={item.image} alt="Product" />
        </div>
        <div className="lg:w-1/3 sm:w-1/2 lg:h-4/5 px-6 sm:py-4">
          <h1 className="font-semibold text-lg">{item.name}</h1>

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2 className="font-semibold text-lg">{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>

          <hr />

          <h2 className="font-semibold text-lg">Overview</h2>

          <p>
            {item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem, iusto, consectetur inventore quod
            soluta quos qui assumenda aperiam, eveniet doloribus commodi error modi eaque! Iure repudiandae temporibus
            ex? Optio!
          </p>
        </div>

        <div className="lg:w-1/4 w-5/6 lg:mx-0 mx-auto sm:p-4  p-2 border-2 lg:h-4/5">
          <h1 className="font-semibold text-lg">{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>

          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button className="px-6 py-3 bg-orange-400 hover:bg-orange-500 rounded-3xl" onClick={buyHandler}>
            Buy Now
          </button>

          <p>
            <small>Ships from</small> Shoppr0x
          </p>
          <p>
            <small>Sold by</small> Shoppr0x
          </p>

          {order && (
            <div className="product__bought">
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + "000")).toLocaleDateString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          )}
        </div>

        <button onClick={togglePop} className="absolute right-3 top-2 ">
          <Image src={close} alt="Close" width={15} />
        </button>
      </div>
    </div>
  );
};
