import { auth, db } from "@/constants/firebase";
import { CalendarRecord } from "@/constants/types";
import { addDoc, collection, deleteField, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";


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
    const preperedData = prepareRecord(record, false); 
    if (!preperedData) return;

    const user = auth.currentUser;

    await addDoc(collection(db, "calendar_data"), {
        ...preperedData,
        uid: user ? user.uid : "0",
    });
}


export const updateMyHomie = async (record:CalendarRecord) => {
    const preperedData = prepareRecord(record, true); 
    if (!preperedData) return;

    await updateDoc(doc(db, "calendar_data", record.id), {
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

const prepareRecord = (record: CalendarRecord, isUpdate = false) => {
    if (!record || !record.date) return null;

    const {id, date, phone, email, ...recordCopy} = record;

    const [day, month, year] = record.date.split("-").map(Number);
    recordCopy.date = Timestamp.fromDate(new Date(year, month - 1, day))

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
}
