import { db, auth } from "@/constants/firebase";
import {collection, getDocs, addDoc, Timestamp} from "firebase/firestore";
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
        console.log(data);
        return data;
    } catch (e:any){
        return null;
    }
}

export const insertMyHomie = async (record:CalendarRecord) => {
    if (!record || !record.date)
        return;
    const user = auth.currentUser;
    const [day, month, year] = record.date.split("-").map(Number);
    await addDoc(collection(db, "calendar_data"), {
        ...record,
        date: Timestamp.fromDate(new Date(year, month - 1, day)),
        uid: (user) ? user.uid : "0",
    });
}