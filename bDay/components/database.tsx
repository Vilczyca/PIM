import { db, auth } from "@/constants/firebase";
import {collection, getDocs, addDoc, Timestamp, updateDoc, doc, deleteField} from "firebase/firestore";
import {CalendarRecord} from "@/constants/types";


const formatted = (date:Date) => {
    return date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).replace(/\./g, "-");
}

export const selectAllMyHomie = async () =>{
    try{
        const documents = await getDocs(collection(db,"calendar_data"));
        const data = documents.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            name: doc.data().name,
            date: doc.data().date ? formatted(doc.data().date.toDate()) : null,
        }));
        return data;
    } catch (e:any){
        return null;
    }
}

export const insertMyHomie = async (record:CalendarRecord) => {
    const preperedData = prepareRecord(record);
    if (preperedData==null)
        return;
    const user = auth.currentUser;
    await addDoc(collection(db, "calendar_data"), {
        ...preperedData,
        uid: (user) ? user.uid : "0",
    });
}

export const updateMyHomie = async (record:CalendarRecord) => {
    const preperedData = prepareRecord(record);
    if (preperedData==null)
        return;
    await updateDoc(doc(db, "calendar_data",record.id), {
        ...preperedData,
    });
}


export const selectRegisteredUsers = async () =>{
    try{
        const documents = await getDocs(collection(db,"registered_users"));
        const data = documents.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            name: doc.data().name,
            date: doc.data().date ? formatted(doc.data().date.toDate()) : null,
        }));
        return data;
    } catch (e:any){
        return null;
    }
}

const prepareRecord = (record:CalendarRecord) => {
    if (!record || !record.date)
        return null;
    const {id, date, phone, email, ...recordCopy} = record;
    const [day, month, year] = record.date.split("-").map(Number);
    recordCopy.date= Timestamp.fromDate(new Date(year, month - 1, day))
    if (record.phone != null) {
        recordCopy.phone = isNaN(record.phone) ? deleteField() : record.phone;
    }
    if (record.email != null) {
        recordCopy.email = (record.email === "") ? deleteField() : record.email;
    }
    return recordCopy;
}