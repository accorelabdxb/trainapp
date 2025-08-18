import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONFETTI_COUNT, DEFAULT_POINTS_BALANCE } from "../constants";
import { CircleChevronRight } from "../lib/icons/CircleChevronRight";
import { X } from "../lib/icons/X";
import { Product } from "../types";
const Redeem = () => {
  const router = useRouter();
  const confettiRef = useRef<ConfettiCannon>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [redeemCode, setRedeemCode] = useState("");

  const { width: screenWidth } = Dimensions.get("window");

  // Product data
  const products = [
    {
      id: 1,
      name: "Protein Powder",
      description:
        "Premium whey protein supplement with 25g of protein per serving. Perfect for post-workout recovery and muscle building. Contains all essential amino acids.",
      points: 200,
      image: require("../assets/images/ad1.jpg"),
      sponsor: {
        name: "NutriFit Supplements",
        logo: require("../assets/images/logo.png"),
        address: "123 Fitness Street, Dubai Marina, UAE",
        contact: "+971 50 123 4567",
      },
    },
    {
      id: 2,
      name: "Gym Towel",
      description:
        "Premium microfiber gym towel that's super absorbent and quick-drying. Perfect size for gym sessions and workouts.",
      points: 100,
      image: require("../assets/images/ad2.png"),
      sponsor: {
        name: "FitGear Pro",
        logo: require("../assets/images/logo.png"),
        address: "456 Sports Avenue, JLT, Dubai, UAE",
        contact: "+971 50 987 6543",
      },
    },
    {
      id: 3,
      name: "Water Bottle",
      description:
        "Insulated sports water bottle that keeps drinks cold for 24 hours. BPA-free and perfect for intense workout sessions.",
      points: 150,
      image: require("../assets/images/ad3.jpg"),
      sponsor: {
        name: "HydroMax Sports",
        logo: require("../assets/images/logo.png"),
        address: "789 Health Boulevard, Business Bay, UAE",
        contact: "+971 50 456 7890",
      },
    },
  ];

  const generateRedeemCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRedeemPress = (product: Product) => {
    // Generate unique code
    const code = generateRedeemCode();
    setRedeemCode(code);
    setSelectedProduct(product);
    setModalVisible(true);

    // Trigger confetti
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  };

  return (
    <View className="flex-1 bg-secbg">
      {/* Fixed Header */}
      <SafeAreaView
        className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="px-6 bg-secbg flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleGoBack}
            className="flex-row items-center"
          >
            <Text className="text-white text-2xl mr-2">←</Text>
            <Text className="text-white text-lg font-medium">Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Redeem Points</Text>
          <View className="w-16"></View>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 bg-black px-4"
        style={{ marginTop: 120 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4">
          {/* Current Points */}
          <View className="p-6 mb-12 mt-8 flex justify-center items-center">
            <View className="mb-4">
              <Image
                className="h-24 w-24 mr-3"
                source={require("../assets/images/star.png")}
              />
              <View className="mt-3">
                <Text className="text-white/60 text-lg mb-3 text-center">
                  Your Points
                </Text>
                <Text className="text-amber-400 text-6xl font-light text-center">
                  {DEFAULT_POINTS_BALANCE}
                </Text>
              </View>
            </View>
            <Text className="text-white/60 text-center text-md">
              Redeem your points for amazing rewards and offers
            </Text>
          </View>

          {/* Featured Rewards */}
          <View className="mb-6">
            <View className="flex flex-row items-center justify-between mb-2">
              <Text className="text-white text-xl font-bold mb-4">
                Featured Rewards
              </Text>
              <CircleChevronRight
                className="text-white/70"
                size={18}
                strokeWidth={1.5}
              />
            </View>
            <TouchableOpacity
              className="bg-secbg rounded-2xl p-4 mb-4 flex-row"
              onPress={() => handleRedeemPress(products[0])}
            >
              <Image
                className="w-20 h-20 rounded-xl mr-4"
                source={products[0].image}
              />
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">
                  {products[0].name}
                </Text>
                <Text className="text-white/60 text-sm mb-2">
                  {products[0].description.substring(0, 40)}...
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="h-4 w-4 mr-1"
                      source={require("../assets/images/star.png")}
                    />
                    <Text className="text-amber-400 font-bold">
                      {products[0].points} pts
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-amber-500 px-4 py-2 rounded-full"
                    onPress={() => handleRedeemPress(products[0])}
                  >
                    <Text className="text-black font-bold text-sm">Redeem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-secbg rounded-2xl p-4 mb-4 flex-row"
              onPress={() => handleRedeemPress(products[1])}
            >
              <Image
                className="w-20 h-20 rounded-xl mr-4"
                source={products[1].image}
              />
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">
                  {products[1].name}
                </Text>
                <Text className="text-white/60 text-sm mb-2">
                  {products[1].description.substring(0, 40)}...
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="h-4 w-4 mr-1"
                      source={require("../assets/images/star.png")}
                    />
                    <Text className="text-amber-400 font-bold">
                      {products[1].points} pts
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-amber-500 px-4 py-2 rounded-full"
                    onPress={() => handleRedeemPress(products[1])}
                  >
                    <Text className="text-black font-bold text-sm">Redeem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-secbg rounded-2xl p-4 mb-4 flex-row"
              onPress={() => handleRedeemPress(products[2])}
            >
              <Image
                className="w-20 h-20 rounded-xl mr-4"
                source={products[2].image}
              />
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">
                  {products[2].name}
                </Text>
                <Text className="text-white/60 text-sm mb-2">
                  {products[2].description.substring(0, 40)}...
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      className="h-4 w-4 mr-1"
                      source={require("../assets/images/star.png")}
                    />
                    <Text className="text-amber-400 font-bold">
                      {products[2].points} pts
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-amber-500 px-4 py-2 rounded-full"
                    onPress={() => handleRedeemPress(products[2])}
                  >
                    <Text className="text-black font-bold text-sm">Redeem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">
              Categories
            </Text>
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity className="bg-secbg rounded-2xl p-4 flex-1 mr-2 items-center">
                <Text className="text-amber-400 text-2xl mb-2">🏋️</Text>
                <Text className="text-white text-sm font-medium">
                  Equipment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-secbg rounded-2xl p-4 flex-1 mx-1 items-center">
                <Text className="text-amber-400 text-2xl mb-2">🥤</Text>
                <Text className="text-white text-sm font-medium">
                  Supplements
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-secbg rounded-2xl p-4 flex-1 ml-2 items-center">
                <Text className="text-amber-400 text-2xl mb-2">👕</Text>
                <Text className="text-white text-sm font-medium">Apparel</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Points History */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-4">
              Recent Activity
            </Text>

            <View className="bg-secbg rounded-2xl p-4 mb-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold">
                    Workout Completed
                  </Text>
                  <Text className="text-white/60 text-sm">
                    Upper Body Push Day
                  </Text>
                </View>
                <Text className="text-green-400 font-bold">+50 pts</Text>
              </View>
            </View>

            <View className="bg-secbg rounded-2xl p-4 mb-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold">
                    Challenge Won
                  </Text>
                  <Text className="text-white/60 text-sm">
                    7-Day Attendance
                  </Text>
                </View>
                <Text className="text-green-400 font-bold">+100 pts</Text>
              </View>
            </View>

            <View className="bg-secbg rounded-2xl p-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-semibold">
                    Weekly Check-in
                  </Text>
                  <Text className="text-white/60 text-sm">
                    5 days this week
                  </Text>
                </View>
                <Text className="text-green-400 font-bold">+25 pts</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confetti Animation */}
      <ConfettiCannon
        ref={confettiRef}
        count={CONFETTI_COUNT}
        origin={{ x: screenWidth / 2, y: 0 }}
        autoStart={false}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={3000}
      />

      {/* Redemption Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <View className="bg-secbg rounded-3xl p-6 mx-4 w-11/12 max-h-5/6">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Close Button */}
              <TouchableOpacity
                className="absolute right-4 top-4 z-10 bg-gray-700 rounded-full p-2"
                onPress={() => setModalVisible(false)}
              >
                <X className="text-white" size={20} />
              </TouchableOpacity>

              {/* Success Header */}
              <View className="items-center mb-6 mt-8">
                <View className="bg-green-500 rounded-full p-4 mb-4">
                  <Text className="text-white text-2xl">✓</Text>
                </View>
                <Text className="text-white text-2xl font-bold mb-2">
                  Redemption Successful!
                </Text>
                <Text className="text-white/60 text-center">
                  Your reward has been redeemed successfully
                </Text>
              </View>

              {selectedProduct && (
                <>
                  {/* Product Image */}
                  <View className="items-center mb-6">
                    <Image
                      className="w-48 h-48 rounded-2xl"
                      source={selectedProduct.image}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Product Info */}
                  <View className="mb-6">
                    <Text className="text-white text-2xl font-bold mb-3 text-center">
                      {selectedProduct.name}
                    </Text>
                    <Text className="text-white/80 text-base leading-6 text-center mb-4">
                      {selectedProduct.description}
                    </Text>
                    <View className="flex-row items-center justify-center">
                      <Image
                        className="h-5 w-5 mr-2"
                        source={require("../assets/images/star.png")}
                      />
                      <Text className="text-amber-400 font-bold text-lg">
                        {selectedProduct.points} points redeemed
                      </Text>
                    </View>
                  </View>

                  {/* Sponsor Info */}
                  <View className="bg-gray-800 rounded-2xl p-4 mb-6">
                    <Text className="text-white font-bold text-lg mb-3 text-center">
                      Sponsored by
                    </Text>
                    <View className="items-center mb-4">
                      <Image
                        className="w-16 h-16 rounded-xl mb-3"
                        source={selectedProduct.sponsor.logo}
                        resizeMode="contain"
                      />
                      <Text className="text-white font-bold text-xl mb-2">
                        {selectedProduct.sponsor.name}
                      </Text>
                    </View>

                    <View className="space-y-2">
                      <View>
                        <Text className="text-white/60 text-sm">Address:</Text>
                        <Text className="text-white text-base">
                          {selectedProduct.sponsor.address}
                        </Text>
                      </View>
                      <View className="mt-3">
                        <Text className="text-white/60 text-sm">Contact:</Text>
                        <Text className="text-white text-base">
                          {selectedProduct.sponsor.contact}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Redeem Code */}
                  <View className="bg-amber-500 rounded-2xl p-6 mb-6">
                    <Text className="text-black font-bold text-lg text-center mb-3">
                      Your Redemption Code
                    </Text>
                    <View className="bg-white rounded-xl p-4 mb-4">
                      <Text className="text-black text-3xl font-bold text-center tracking-widest">
                        {redeemCode}
                      </Text>
                    </View>
                    <Text className="text-black text-sm text-center font-medium">
                      Display this code at the shop to redeem your reward
                    </Text>
                  </View>

                  {/* Instructions */}
                  <View className="bg-blue-600 rounded-2xl p-4 mb-6">
                    <Text className="text-white font-bold text-base mb-2">
                      How to Redeem:
                    </Text>
                    <Text className="text-white/90 text-sm leading-5">
                      1. Visit the sponsor location{"\n"}
                      2. Show this redemption code{"\n"}
                      3. Present a valid ID{"\n"}
                      4. Enjoy your reward!
                    </Text>
                  </View>

                  {/* Close Button */}
                  <TouchableOpacity
                    className="bg-amber-500 rounded-2xl p-4"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-black font-bold text-center text-lg">
                      Got it!
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Redeem;
