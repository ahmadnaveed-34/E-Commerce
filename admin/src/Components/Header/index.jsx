import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { RiMenu2Line } from "react-icons/ri";
import { FaEyeSlash, FaRegBell, FaRegEye } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import AddProduct from "../../Pages/Products/addProduct";
import AddHomeSlide from "../../Pages/HomeSliderBanners/addHomeSlide";
import AddCategory from "../../Pages/Categegory/addCategory";
import AddSubCategory from "../../Pages/Categegory/addSubCategory";
import AddAddress from "../../Pages/Address/addAddress";
import EditCategory from "../../Pages/Categegory/editCategory";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import Slide from "@mui/material/Slide";
import EditProduct from "../../Pages/Products/editProduct";
import { AddBannerV1 } from "../../Pages/Banners/addBannerV1";
import { EditBannerV1 } from "../../Pages/Banners/editBannerV1";
import { BannerList2_AddBanner } from "../../Pages/Banners/bannerList2_AddBanner";
import { BannerList2_Edit_Banner } from "../../Pages/Banners/bannerList2_Edit_Banner";
import AddBlog from "../../Pages/Blog/addBlog";
import EditBlog from "../../Pages/Blog/editBlog";
import EditHomeSlide from "../../Pages/HomeSliderBanners/editHomeSlide";
import { CircularProgress } from "@mui/material";
import { TextField, Select, InputLabel, FormControl } from "@mui/material";
import { IoClose } from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setisPasswordShow] = useState(false);

  const history = useNavigate();

  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  const context = useContext(MyContext);

  const location = useLocation();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem("logo", res?.logo[0]?.logo);
    });

    const token = localStorage.getItem("accessToken");

    if (token !== undefined && token !== null && token !== "") {
      const url = window.location.href;
      history(location.pathname);
    } else {
      history("/login");
    }
  }, [context?.isLogin, context?.fetchAgainData]);

  const logout = () => {
    setAnchorMyAcc(null);

    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true }
    ).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history("/login");
      }
    });
  };

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value,
    }));
  };

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8); // Random 8-character password
    setFormFields({ ...formFields, password: newPassword });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter full name");
      return setIsLoading(false);
    }

    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return setIsLoading(false);
    }

    if (formFields.password === "") {
      context.alertBox("error", "Please generate password");
      return setIsLoading(false);
    }

    if (formFields.role === "") {
      context.alertBox("error", "Please select user role");
      return setIsLoading(false);
    }

    postData("/api/user/addUser", formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox("success", res?.message);
        context?.setOpenAddUserModal(false);
      } else {
        context.alertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <header
        className={`w-full z-[51] h-[auto] py-2 ${
          context.isSidebarOpen === true ? "pl-[22%]" : "pl-5"
        } ${
          context.isSidebarOpen === true &&
          context?.windowWidth < 992 &&
          "!pl-80"
        } shadow-md pr-7 bg-[#fff]  flex items-center justify-between transition-all fixed top-0 left-0 z-[50]`}
      >
        <div className="part1 flex items-center gap-4">
          {context.isSidebarOpen === false && context?.windowWidth > 992 && (
            <div
              className="col"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false);
              }}
            >
              <Link to="/">
                <img
                  src={localStorage.getItem("logo")}
                  className="w-[60px] md:w-[70px]"
                />
              </Link>
            </div>
          )}

          <Button
            className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)]"
            onClick={() => context.setisSidebarOpen(!context.isSidebarOpen)}
          >
            <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
          </Button>
        </div>

        <div className="part2  flex items-center justify-end gap-5">
          {context.isLogin === true ? (
            <div className="relative">
              <div
                className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                onClick={handleClickMyAcc}
              >
                {context?.userData?.avatar !== "" &&
                context?.userData?.avatar !== null &&
                context?.userData?.avatar !== undefined ? (
                  <img
                    src={context?.userData?.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/user.jpg" className="w-full h-full object-cover" />
                )}
              </div>

              <Menu
                anchorEl={anchorMyAcc}
                id="account-menu"
                open={openMyAcc}
                onClose={handleCloseMyAcc}
                onClick={handleCloseMyAcc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                      {context?.userData?.avatar !== "" &&
                      context?.userData?.avatar !== null &&
                      context?.userData?.avatar !== undefined ? (
                        <img
                          src={context?.userData?.avatar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/user.jpg"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="info">
                      <h3 className="text-[15px] font-[500] leading-5">
                        {context?.userData?.name}
                      </h3>
                      <p className="text-[12px] font-[400] opacity-70">
                        {context?.userData?.email}
                      </p>
                    </div>
                  </div>
                </MenuItem>
                <Divider />

                <Link to="/profile">
                  <MenuItem
                    onClick={handleCloseMyAcc}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser className="text-[16px]" />{" "}
                    <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>

                <MenuItem onClick={logout} className="flex items-center gap-3">
                  <IoMdLogOut className="text-[18px]" />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className="btn-blue btn-sm !rounded-full">Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() =>
          context?.setIsOpenFullScreenPanel({
            open: false,
          })
        }
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() =>
                context?.setIsOpenFullScreenPanel({
                  open: false,
                })
              }
              aria-label="close"
            >
              <IoMdClose className="text-gray-800" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">
                {context?.isOpenFullScreenPanel?.model}
              </span>
            </Typography>
          </Toolbar>
        </AppBar>

        {context?.isOpenFullScreenPanel?.model === "Add Product" && (
          <AddProduct />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add Home Slide" && (
          <AddHomeSlide />
        )}

        {context?.isOpenFullScreenPanel?.model === "Edit Home Slide" && (
          <EditHomeSlide />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add New Category" && (
          <AddCategory />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add New Sub Category" && (
          <AddSubCategory />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add New Address" && (
          <AddAddress />
        )}

        {context?.isOpenFullScreenPanel?.model === "Edit Category" && (
          <EditCategory />
        )}

        {context?.isOpenFullScreenPanel?.model === "Edit Product" && (
          <EditProduct />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add Home Banner List 1" && (
          <AddBannerV1 />
        )}

        {context?.isOpenFullScreenPanel?.model === "Secondary Banner" && (
          <EditBannerV1 />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add Main Banner" && (
          <BannerList2_AddBanner />
        )}

        {context?.isOpenFullScreenPanel?.model === "Edit bannerList2" && (
          <BannerList2_Edit_Banner />
        )}

        {context?.isOpenFullScreenPanel?.model === "Add Blog" && <AddBlog />}

        {context?.isOpenFullScreenPanel?.model === "Edit Blog" && <EditBlog />}
      </Dialog>

      <Dialog
        open={context?.openAddUserModal}
        onClose={() => {
          context?.handleCloseAddUser();
          setFormFields({
            name: "",
            email: "",
            password: "",
            role: "",
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form
          className="w-full max-w-lg mx-auto p-8 md:p-6 bg-white rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-end">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              onClick={() => {
                context?.handleCloseAddUser?.();
                setFormFields({
                  name: "",
                  email: "",
                  password: "",
                  role: "",
                });
              }}
              aria-label="Close"
            >
              <IoClose className="text-2xl text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create New Account
            </h2>
          </div>

          <div className="mb-3">
            <label
              htmlFor="full name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <FormControl fullWidth size="small" variant="outlined">
              <TextField
                id="name"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                size="small"
                required
                disabled={isLoading}
              />
            </FormControl>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <FormControl fullWidth size="small" variant="outlined">
              <TextField
                id="email"
                name="email"
                type="email"
                value={formFields.email}
                onChange={onChangeInput}
                disabled={isLoading}
                size="small"
                required
                variant="outlined"
              />
            </FormControl>
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formFields.role}
              onChange={onChangeInput}
              disabled={isLoading}
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-700 focus:border-blue-500 outline-none transition duration-150"
            >
              <option value={null}>Select Role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Password with Generate Button */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
              Password
            </label>
            <Button
              type="button"
              className="!w-full !py-3 !text-sm !font-semibold !text-white bg-gradient-to-r !from-green-600 !to-green-700 hover:!from-green-700 hover:!to-green-800 !rounded-xl !shadow-lg hover:!shadow-xl !transition-all !duration-200 !ease-in-out"
              onClick={generatePassword}
            >
              🔐 Generate Secure Password
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="btn-blue btn-lg w-full mt-2">
            {isLoading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default Header;
