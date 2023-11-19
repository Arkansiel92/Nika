import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorage = () => {
    const [value, setValue] = useState<string | null>(null);

    const setItem = async (key: string, value: string) => {
        await AsyncStorage.setItem(
            key,
            value
        );

        setValue(value);
    }

    const getItem = async (key: string) => {
        const value = await AsyncStorage.getItem(key);

        setValue(value);
        return value;
    }

    const removeItem = async (key: string) => {
        await AsyncStorage.removeItem(key);
        setValue(null);
    }

    return { value, setItem, getItem, removeItem };
}