import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        (async () => {
            if (!permission?.granted) {
                await requestPermission();
            }
        })();
    }, [permission, requestPermission]);

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className="flex-1 justify-center items-center bg-secbg">
                <Text className="text-white text-center">We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Text className="text-blue-500 mt-2">Grant permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-secbg">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
            >
                <View className="flex-1 justify-end pb-20">
                    <View className="flex-row justify-center">
                        <TouchableOpacity
                            className="bg-white rounded-full p-4 mx-4"
                            onPress={toggleCameraFacing}
                        >
                            <Text className="text-black font-semibold">Flip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}