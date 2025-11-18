import { auth, db } from "@/constants/firebase";
import { CalendarRecord } from "@/constants/types";
import {
  addDoc,
  collection,
  deleteField,
    deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
    where,
    query,
} from "firebase/firestore";

const formatted = (date: Date) => {
  return date
    .toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\./g, "-");
};

export const selectAllMyHomie = async (uid: string) => {
  try {
    const q = query(
          collection(db, "calendar_data"),
          where("uid", "==", uid)
      );
      const documents = await getDocs(q);
    const data = documents.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: doc.data().name,
      date: doc.data().date ? formatted(doc.data().date.toDate()) : null,
    }));
    return data;
  } catch (e: any) {
    console.log(e);
  }
};

export const insertMyHomie = async (record: CalendarRecord) => {
  const preperedData = prepareRecord(record, false);
  if (!preperedData) return;

  const user = auth.currentUser;

  await addDoc(collection(db, "calendar_data"), {
    ...preperedData,
    uid: user ? user.uid : "0",
  });
};

export const updateMyHomie = async (record: CalendarRecord) => {
  const preperedData = prepareRecord(record, true);
  if (!preperedData) return;

  await updateDoc(doc(db, "calendar_data", record.id), {
    ...preperedData,
  });
};

export const selectRegisteredUsers = async () => {
  try {
    const documents = await getDocs(collection(db, "registered_users"));
    const data = documents.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: doc.data().name,
      date: doc.data().date ? formatted(doc.data().date.toDate()) : null,
    }));
    return data;
  } catch (e: any) {
    return null;
  }
};

export const updateUserInRegisteredUsers = async (
  uid: string,
  userData: {
    name: string;
    date: string;
    email: string;
  }
) => {
  try {
    const { name, date, email } = userData;

    const [day, month, year] = date.split("-").map(Number);
    const birthdayTimestamp = Timestamp.fromDate(
      new Date(year, month - 1, day)
    );

    await updateDoc(doc(db, "registered_users", uid), {
      name,
      email,
      date: birthdayTimestamp,
    });
  } catch (error) {
        console.error("Error updating user in registered_users:", error);
  }
};

const prepareRecord = (record: CalendarRecord, isUpdate = false) => {
  if (!record || !record.date) return null;

  const { id, date, phone, email, ...recordCopy } = record;

  const [day, month, year] = record.date.split("-").map(Number);
  recordCopy.date = Timestamp.fromDate(new Date(year, month - 1, day));

  if (phone != null) {
    if (!isUpdate || !isNaN(phone)) {
      recordCopy.phone = phone;
    } else if (isUpdate && isNaN(phone)) {
      recordCopy.phone = deleteField();
    }
  }

  if (email != null) {
    if (!isUpdate || email !== "") {
      recordCopy.email = email;
    } else if (isUpdate && email === "") {
      recordCopy.email = deleteField();
    }
  }

  return recordCopy;
};

export const addRegisteredUser = async (uid:string, userData: {
  name: string;
  email: string;
  date: string;
}) => {
  try {
    const { name, email, date } = userData;

    const [day, month, year] = date.split("-").map(Number);
    const birthdayTimestamp = Timestamp.fromDate(
      new Date(year, month - 1, day)
    );

    await setDoc(doc(db, "registered_users", uid), {
      name,
      email,
      date: birthdayTimestamp,
    });

  } catch (error) {
    console.error("Error adding user to registered_users:", error);
  }
};

export const getCurrentUserData = () => {
  const user = auth.currentUser;
  if (!user) return null;

  return {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
  };
};

export const deleteMyHomie = async (id: string) => {
    try {
        await deleteDoc(doc(db, "calendar_data", id));
    } catch (e) {
        console.log("deleteMyHomie error", e);
    }
};
