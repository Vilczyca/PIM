import { useColors } from "@/hooks/use-colors";
import React, { useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;

type SpinnerProps = {
  value?: string;
  onChange?: (date: string) => void;
};

export function Spinner({ value = "01-01-2025", onChange }: SpinnerProps) {
  const colors = useColors();
  
  const parseDate = (val: string) => {
    const [d, m, y] = val.split("-").map(Number);
    return { day: d, month: m - 1, year: y }; 
  };
  
  const today = new Date();
  const { day: initDay, month: initMonth, year: initYear } = parseDate(value);
  
  const [day, setDay] = useState(initDay);
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);

  const dayRef = useRef<ScrollView>(null);
  const monthRef = useRef<ScrollView>(null);
  const yearRef = useRef<ScrollView>(null);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const years = Array.from({ length: 101 }, (_, i) => today.getFullYear() - i);

  const isInitialMount = useRef(true);

  useEffect(() => {
    const { day: newDay, month: newMonth, year: newYear } = parseDate(value);

    if (newDay !== day || newMonth !== month || newYear !== year) {
      setDay(newDay);
      setMonth(newMonth);
      setYear(newYear);

      dayRef.current?.scrollTo({ y: (newDay - 1) * ITEM_HEIGHT, animated: false });
      monthRef.current?.scrollTo({ y: newMonth * ITEM_HEIGHT, animated: false });

      const yearIndex = years.indexOf(newYear);
      if (yearIndex >= 0) {
        yearRef.current?.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }
    }
  }, [value]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      dayRef.current?.scrollTo({ y: (day - 1) * ITEM_HEIGHT, animated: false });
      monthRef.current?.scrollTo({ y: month * ITEM_HEIGHT, animated: false });

      const yearIndex = years.indexOf(year); 
      if (yearIndex >= 0) {
        yearRef.current?.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }
    }
  }, []);

  useEffect(() => {
    const maxDay = getDaysInMonth(year, month);
    const validDay = Math.min(day, maxDay);

    if (validDay !== day) {
      setDay(validDay);
    } else if (!isInitialMount.current) {
      const formatted = `${String(validDay).padStart(2, "0")}-${String(month + 1).padStart(2, "0")}-${year}`;
      onChange?.(formatted);
    }
  }, [day, month, year]);

  const handleMomentumEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    data: number[],
    setter: (val: number) => void,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    
    setter(data[clamped]);
    scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
  };

const renderColumn = (
  data: number[],
  value: number,
  setter: (val: number) => void,
  ref: React.RefObject<ScrollView | null>,
  isMonth = false
) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.column}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      snapToAlignment="center"
      decelerationRate="fast"
      scrollEventThrottle={16}
      nestedScrollEnabled
      contentContainerStyle={{
        paddingTop: ITEM_HEIGHT,
        paddingBottom: ITEM_HEIGHT * 2, 
      }}
      onScroll={handleScroll}
      onMomentumScrollEnd={(e) => handleMomentumEnd(e, data, setter, ref)}
    >
      {data.map((item, index) => {
        // Obliczamy który element jest aktualnie na środku
        const currentCenterIndex = Math.round(scrollOffset / ITEM_HEIGHT);
        const isInHighlightZone = index === currentCenterIndex;
        
        return (
          <View key={item} style={styles.item}>
            <Text style={[
              styles.text, 
              { 
                color: isInHighlightZone ? colors.tint : colors.text,
                fontWeight: isInHighlightZone ? '700' : 'normal'
              }
            ]}>
              {isMonth ? item + 1 : item}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* 1. Tło strefy zaznaczenia - najniżej */}
      <View style={[styles.highlightArea, { backgroundColor: colors.card }]} pointerEvents="none" />
      
      {/* 2. Cyfry - nad tłem */}
      <View style={styles.container}>
        {renderColumn(days, day, setDay, dayRef)}
        {renderColumn(months, month, setMonth, monthRef, true)}
        {renderColumn(years, year, setYear, yearRef)}
      </View>
      
      {/* 3. Linie - najwyżej */}
      <View style={[
        styles.highlightLine, 
        { 
          borderColor: colors.tint,
        }
      ]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
    borderRadius: 12,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    zIndex: 1,
  },
  column: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  highlightArea: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    zIndex: 0,
  },
  highlightLine: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 2,
  },
});