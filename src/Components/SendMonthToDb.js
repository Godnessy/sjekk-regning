import { React, useState, useEffect } from "react";
import { db } from "../firebase-config.js";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import prices from "../Resources/price_json/October.json";

function SendMonthToDB() {
  const [month, setMonth] = useState();
  const monthName = "October";
  const monthRef = doc(db, "price-history", monthName);

  const sendMonth = async (docRef) => {
    await setDoc(monthRef, prices);
    console.log("doc set");
  };

  const getMonth = async () => {
    const docSnap = await getDoc(monthRef);

    if (docSnap.exists()) {
      console.log("Doc data:", docSnap.data());
    } else {
      console.log("Doc does not exist");
    }
  };

  useEffect(() => {
    sendMonth();
  }, []);

  return <div>SendMonthToDB</div>;
}

export default SendMonthToDB;
