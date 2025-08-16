import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log('📸 Photo taken:', photo.uri);
            // You can navigate, save, or share the photo from here
        }
    };

    if (hasPermission === null) {
        return <View className="flex-1 bg-black items-center justify-center"><Text className="text-white">Requesting Camera...</Text></View>;
    }

    if (hasPermission === false) {
        return <View className="flex-1 bg-black items-center justify-center"><Text className="text-white">No access to camera</Text></View>;
    }

    return (
        <View className="flex-1 bg-black">
            <Camera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
            />
            <TouchableOpacity
                className="absolute bottom-10 left-1/2 -ml-8 bg-white p-4 rounded-full"
                onPress={takePicture}
            >
                <Text className="text-black font-bold">Snap</Text>
            </TouchableOpacity>
        </View>
    );
}