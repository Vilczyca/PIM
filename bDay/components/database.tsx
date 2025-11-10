import { auth, db } from "@/constants/firebase";
import { CalendarRecord } from "@/constants/types";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
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

export const selectAllMyHomie = async () => {
  try {
    const documents = await getDocs(collection(db, "calendar_data"));
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

// DODAJ TE FUNKCJE:
export const getRegisteredUsers = async () => {
  try {
    const documents = await getDocs(collection(db, "registered_users"));
    const data = documents.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: doc.data().name,
      date: doc.data().date ? formatted(doc.data().date.toDate()) : null,
      uid: doc.data().uid,
      email: doc.data().email,
    }));
    return data;
  } catch (e: any) {
    console.error("Error fetching registered users:", e);
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
      uid: uid,
      date: birthdayTimestamp,
      updatedAt: Timestamp.now(),
    });

    console.log("User updated in registered_users collection");
  } catch (error) {
    console.error("Error updating user in registered_users:", error);
    throw error;
  }
};

export const getUserByUid = async (uid: string) => {
  try {
    const documents = await getDocs(collection(db, "registered_users"));
    const user = documents.docs.find((doc) => doc.data().uid === uid);

    if (user) {
      const userData = user.data();
      let formattedDate = null;

      if (userData.date) {
        const date = userData.date.toDate();
        // Zawsze formatuj jako DD-MM-YYYY dla Spinnera
        formattedDate = date
          .toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\./g, "-");
      }

      return {
        id: user.id,
        ...userData,
        name: userData.name,
        date: userData.date ? formattedDate : null,
        uid: userData.uid,
        email: userData.email,
      };
    }
    return null;
  } catch (e: any) {
    console.error("Error fetching user by UID:", e);
    return null;
  }
};
// KONIEC DODANYCH FUNKCJI

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

export const addRegisteredUser = async (userData: {
  uid: string;
  name: string;
  email: string;
  date: string;
}) => {
  try {
    const { uid, name, email, date } = userData;

    const [day, month, year] = date.split("-").map(Number);
    const birthdayTimestamp = Timestamp.fromDate(
      new Date(year, month - 1, day)
    );

    await setDoc(doc(db, "registered_users", uid), {
      name,
      email,
      date: birthdayTimestamp,
      createdAt: Timestamp.now(),
      uid: uid,
    });

    console.log("User added to registered_users collection");
  } catch (error) {
    console.error("Error adding user to registered_users:", error);
    throw error;
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
