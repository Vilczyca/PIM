import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export function Sipnner(
    { onChange, value }: { 
        onChange?: (date: Date) => void;
        value?: Date
     }
    
){
    const today = new Date();

    const months =[
            "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ]

const days = Array.from({length:31},(_,i)=>i+1);
const years = Array.from({length:100},(_,i)=>today.getFullYear()-i);
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
    const handleChange = (newDay = day, newMonth = month, newYear = year) => {
    const newDate = new Date(newYear, newMonth, newDay);
    onChange?.(newDate);
  };
return(
    <View>
        <FlatList
            data={days}
            keyExtractor={(item)=>item.toString()}
           
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={40}
            decelerationRate="fast"
            renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => {
                setDay(item);
                handleChange(item, month, year);
                }}
            >
                <Text >{item}</Text>
            </TouchableOpacity>
            )}
            
        />
       
      <FlatList
        data={months}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setMonth(index);
              handleChange(day, index, year);
            }}
          >
            <Text >{item}</Text>
          </TouchableOpacity>
        )}
      />

     
      <FlatList
        data={years}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setYear(item);
              handleChange(day, month, item);
            }}
          >
            <Text >{item}</Text>
          </TouchableOpacity>
        )}
      />


    </View>
);

}