export const Navigation = ({ account, setAccount }) => {
  return (
    <nav>
      <ul className="md:w-3/5 lg:1-2 flex md:gap-6 mx-auto bg-base-300 md:text-sm text-xs justify-around  rounded-b-xl md:p-4 p-3 mb-10">
        <li className="hover:text-orange-500">
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li className="hover:text-orange-500">
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li className="hover:text-orange-500">
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
};
