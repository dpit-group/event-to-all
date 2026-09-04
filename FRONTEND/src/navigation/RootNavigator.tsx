import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@react-native-vector-icons/ionicons";

import { AccountScreen } from "../screens/AccountScreen";
import { FavoriteScreen } from "../screens/FavoriteScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { PRIMARY_COLOR } from "../constant";
import { FilterScreen } from "../screens/FilterScreen";

export type RootTabParamList = {
  Account: undefined;
  Favorite: undefined;
  Home: undefined;
  Search: undefined;
  Map: undefined;
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
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <SearchStack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          title: "FILTER",
          headerShown: false,
          headerStyle: {},
          headerTintColor: "#1d1d1d",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
        }}
      />
    </SearchStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
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
        component={HomeScreen}
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
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: "Favorite",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
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
