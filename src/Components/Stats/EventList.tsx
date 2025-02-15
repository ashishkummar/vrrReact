import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Loading from "./Loading"; // Your loading component

// Initialize Firestore
const db = getFirestore();

interface Event {
  eventName: string;
}

const EventList = () => {
  const [eventCounts, setEventCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "extension_events"));
        const counts: { [key: string]: number } = {};

        querySnapshot.forEach((doc) => {
          const event = doc.data() as Event;
          counts[event.eventName] = (counts[event.eventName] || 0) + 1;
        });

        setEventCounts(counts);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading /> // Show loading indicator
      ) : (
        <div>
          <h3>Event Counts</h3>
          <div style={styles.container}>
            {/* Header Row */}
            <div style={{ ...styles.row, fontWeight: "bold", backgroundColor: "#f3f3f3" }}>
              <div style={styles.cell}>Event Name</div>
              <div style={styles.cell}>Total Count</div>
            </div>

            {/* Data Rows */}
            {Object.keys(eventCounts).length > 0 ? (
              //@ts-ignore
              (Object.entries(eventCounts) as [string, number][]).map(([eventName, count]) => (
                <div key={eventName} style={styles.row}>
                  <div style={styles.cell}>{eventName}</div>
                  <div style={styles.cell}>{count}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "10px" }}>No events found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Correctly Typed Inline Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
    width: "300px",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid #ccc",
    padding: "10px",
  },
  cell: {
    flex: 1,
    padding: "5px",
  },
};

export default EventList;
