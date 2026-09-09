import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@react-native-vector-icons/ionicons";

import { AccountScreen } from "../screens/AccountScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { FavoriteScreen } from "../screens/FavoriteScreen";
import { EventScreen } from "../screens/EventScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { PRIMARY_COLOR } from "../constant";

export type RootTabParamList = {
  Account: undefined;
  Favorite: undefined;
  Home: undefined;
  Search: undefined;
  Map: undefined;
  MyEvents: undefined;
};

export type AccountStackParamList = {
  AccountMain: undefined;
  Register: undefined;
  AddEvent: undefined;
  EditEvent: { event?: Event } | undefined;
};

export type MyEventsStackParamList = {
  MyEventsMain: { removedEventId?: number } | undefined;
  Event: { event: Event; fromMyEvents?: boolean };
  EditEvent: { event: Event };
};

export type FavoriteStackParamList = {
  FavoriteMain: { removedEventId?: number } | undefined;
  Event: { event: Event; fromFavorites?: boolean };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Event: { event: Event };
};

export type SearchStackParamList = {
  SearchMain: {
    appliedFilters?: {
      startDate: string | null;
      endDate: string | null;
      distance: number;
      types: string[];
      ageLimit?: string;
    } | null;
  };
  Filter:
    | {
        currentFilters?: {
          startDate: string | null;
          endDate: string | null;
          distance: number;
          types: string[];
          ageLimit?: string;
        } | null;
      }
    | undefined;
  Event: { event: Event };
};

export type SearchStackParamList = {
  SearchMain: {
    appliedFilters?: {
      date: string | null;
      distance: number;
      types: string[];
    } | null;
  };
  Filter: {
    currentFilters?: {
      date: string | null;
      distance: number;
      types: string[];
    } | null;
  } | undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator({
  initialRouteName = "Home",
}: {
  initialRouteName?: keyof RootTabParamList;
}) {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          height: 100,
        },
        headerTintColor: "#1d1d1d",
        headerTitleAlign: "left",
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: "gray",
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteStackNavigator}
        options={{
          title: "Favorite",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyEvents"
        component={MyEventsStackNavigator}
        options={{
          title: "My Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackNavigator}
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}