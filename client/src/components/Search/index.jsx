import React, { useContext, useEffect, useState } from "react";
import "../Search/style.css";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const context = useContext(MyContext);

  const history = useNavigate();

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);

    const obj = {
      query: e.target.value,
    };

    if (e.target.value.trim() !== "") {
      setIsShowDropDown(true);
      postData(`/api/product/search/get`, obj).then((res) => {
        setSearchResults(res?.products);
        console.log(res?.products);
      });
    } else {
      setIsShowDropDown(false);
    }
  };

  const search = () => {
    setIsLoading(true);

    const obj = {
      page: 1,
      limit: 3,
      query: searchQuery,
    };

    if (searchQuery !== "") {
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res);
        console.log(res);
        setTimeout(() => {
          setIsLoading(false);
          context?.setOpenSearchPanel(false);
          history("/search");
        }, 1000);
      });
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery("");
    setIsShowDropDown(false);
  }, [history]);

  return (
    <>
      <div className="relative">
        <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
            value={searchQuery}
            onChange={onChangeInput}
          />
          <Button
            className="!absolute top-[8px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
            onClick={search}
          >
            {isLoading === true ? (
              <CircularProgress />
            ) : (
              <IoSearch className="text-[#4e4e4e] text-[22px]" />
            )}
          </Button>
        </div>
        {isShowDropDown === true && (
          <div className="bg-white absolute left-0 w-full max-h-52 overflow-y-auto rounded-md shadow-lg mt-2 z-10 p-4">
            {searchResults.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item?._id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition"
                onClick={() => setIsShowDropDown(false)}
              >
                <img
                  src={item?.images[0]}
                  alt="img"
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-gray-800 font-medium text-sm">
                    {item?.name}
                  </h2>
                  <p className="text-gray-500 text-xs">
                    {item?.brand} | {item?.catName}
                  </p>
                </div>
              </Link>
            ))}

            {searchResults?.length === 0 && (
              <div className="text-center text-gray-500 py-3 text-lg font-medium">
                No product found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
