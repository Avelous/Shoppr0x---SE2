import { useEffect, useState } from "react";
import Head from "next/head";
import { getAccount, readContract } from "@wagmi/core";
import type { NextPage } from "next";
import { useContract, useProvider } from "wagmi";
import { Navigation } from "~~/components/home/Navigation";
import { Product } from "~~/components/home/Product";
import { Section } from "~~/components/home/Section";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

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

const Home: NextPage = () => {
  const provider = useProvider();
  const account = getAccount();

  const [toggle, setToggle] = useState(false);
  const [electronics, setElectronics] = useState<any>(null);
  const [clothing, setClothing] = useState<any>(null);
  const [toys, setToys] = useState<any>(null);
  const [item, setItem] = useState<item | any>({});

  let contractAddress: any;
  let contractABI: any;

  const { data: deployedContractData } = useDeployedContractInfo("YourContract");
  if (deployedContractData) {
    ({ address: contractAddress, abi: contractABI } = deployedContractData);
  }

  const contract = useContract({
    address: contractAddress,
    abi: contractABI,
    signerOrProvider: provider,
  });

  console.log(contract);

  const togglePop = (item: any) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    const items = [];

    for (let i = 0; i < 9; i++) {
      const item = await readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "items",
        args: [i],
      });
      items.push(item);
    }
    console.log(items);

    const electronics = items.filter(item => item.category === "electronics");
    const clothing = items.filter(item => item.category === "clothing");
    const toys = items.filter(item => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  useEffect(() => {
    if (deployedContractData) loadBlockchainData();
  }, [deployedContractData, contractABI]);

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      {/* <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">scaffold-eth 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/nextjs/pages/index.tsx</code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract <code className="italic bg-base-300 text-base font-bold">YourContract.sol</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">packages/hardhat/contracts</code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
          </div>
        </div> */}

      <div>
        <Navigation />

        {electronics && clothing && toys && (
          <>
            <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
            <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
            <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
          </>
        )}

        {toggle && (
          <Product item={item} account={account.address} shoppr0x={contract} abi={contractABI} togglePop={togglePop} />
        )}
      </div>
    </>
  );
};

export default Home;
