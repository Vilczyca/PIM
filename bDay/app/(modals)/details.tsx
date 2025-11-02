import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useColor } from "@/hooks/use-colors";
import { DetailsView } from "@/components/views/details-view"; //uwazaj na wielkosc liter

export default function AddDetailsModal() {
    const router = useRouter();
    const navigation = useNavigation();
    const tint = useColor("tint");

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         title: "Dodaj urodziny",
    //         headerLeft: () => null,
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
    //                 <Feather name="x" size={22} color={tint} />
    //             </TouchableOpacity>
    //         ),
    //         gestureEnabled: false,
    //         presentation: "modal", //opcjonalnie
    //     });
    // }, [navigation, router, tint]);

    const handleSaveAdd = (data:{name:string; birthday:string}) => {
        //todo: persist add (api/store)
        router.back(); //zamknij modal po zapisie
    };

    return (
        <DetailsView
            mode="add"
            onSaveAdd={handleSaveAdd}
        />
    );
}
