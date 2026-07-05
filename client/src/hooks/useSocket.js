import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { updateBalance } from "../features/wallet/walletSlice";

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("/", { withCredentials: true });
    socketRef.current.emit("join", userId);
    socketRef.current.on("balance_update", ({ newBalance }) => {
      dispatch(updateBalance(newBalance));
    });
    return () => { socketRef.current?.disconnect(); };
  }, [userId, dispatch]);
  return socketRef.current;
};
