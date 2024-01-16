import { useEffect } from "react";
import { useAppDispatch } from "store";
import { setIsOffline } from "store/sessionSlice";
//import api from "utils/api";

export const GlobalConfig = ({}: {}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // (async function checkOnlineStatus() {
    //   const res = await api.get("check");
    //   if (res.error) dispatch(setIsOffline(true));
    // })();

    window.addEventListener("offline", () => {
      dispatch(setIsOffline(true));
    });

    window.addEventListener("online", () => {
      dispatch(setIsOffline(false));
    });
  }, []);

  return null;
};
