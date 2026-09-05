import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, ScrollView, View} from "react-native";

export type Event = {
	id: number;
	name: string;
	city: string;
	address: string;
	lat: number;
	lng: number;
	date: string;
	time: string;
	minAge?: number;
	artist?: string;
	imageUrl: string;
};

type EventScreenProps = {
	route: { params: { event: Event } };
};

export function EventScreen({ route }: EventScreenProps) {
	const { event } = route.params;

	return (
		<ScrollView style={styles.container}>
			<Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
			<View style={styles.hero}>
				<Text style={styles.eyebrow}>{event.city.toUpperCase()}</Text>
				<Text style={styles.title}>{event.name}</Text>
				{event.artist ? <Text style={styles.artist}>{event.artist}</Text> : null}
			</View>

			<View style={styles.detailsCard}>
				<Text style={styles.sectionTitle}>Event details</Text>
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>When</Text>
					<Text style={styles.detailValue}>{event.date} at {event.time}</Text>
				</View>
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>Where</Text>
					<Text style={styles.detailValue}>{event.address}, {event.city}</Text>
				</View>
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>Coordinates</Text>
					<Text style={styles.detailValue}>{event.lat}, {event.lng}</Text>
				</View>
				{event.minAge !== undefined ? (
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Minimum age</Text>
						<Text style={styles.detailValue}>{event.minAge}+</Text>
					</View>
				) : null}
			</View>
			<StatusBar style="light" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f3ff",
	},
	hero: {
		backgroundColor: "#6f01ff",
		paddingHorizontal: 24,
		paddingTop: 42,
		paddingBottom: 48,
	},
	heroImage: {
		width: "100%",
		height: 230,
	},
	eyebrow: {
		color: "#e5d6ff",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 1.5,
		marginBottom: 12,
	},
	title: {
		color: "#fff",
		fontSize: 34,
		fontWeight: "800",
	},
	artist: {
		color: "#f0eaff",
		fontSize: 18,
		marginTop: 12,
	},
	detailsCard: {
		backgroundColor: "#fff",
		borderRadius: 14,
		margin: 20,
		padding: 22,
		shadowColor: "#241044",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.12,
		shadowRadius: 12,
		elevation: 4,
	},
	sectionTitle: {
		color: "#20233d",
		fontSize: 20,
		fontWeight: "800",
		marginBottom: 14,
	},
	detailRow: {
		borderTopWidth: 1,
		borderTopColor: "#eeeaf7",
		paddingVertical: 14,
	},
	detailLabel: {
		color: "#77718a",
		fontSize: 13,
		fontWeight: "700",
		marginBottom: 5,
		textTransform: "uppercase",
	},
	detailValue: {
		color: "#20233d",
		fontSize: 16,
		lineHeight: 22,
	},
});
