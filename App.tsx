
// import React, { useEffect, useRef, useState } from "react";
// import {
//   SafeAreaView,
//   ScrollView,
//   Text,
//   View,
//   Pressable,
//   StyleSheet,
// } from "react-native";
// import { DeviceMotion } from "expo-sensors";

// type Axis = "alpha" | "beta" | "gamma";

// export default function App() {
//   const [available, setAvailable] = useState(false);
//   const [axis, setAxis] = useState<Axis>("gamma");
//   const [angle, setAngle] = useState(0);
//   const [center, setCenter] = useState(0);
//   const [range, setRange] = useState(45);

//   const centerRef = useRef(0);
//   const rangeRef = useRef(45);
//   const axisRef = useRef<Axis>("gamma");
//   const smoothRef = useRef(0);

//   useEffect(() => {
//     axisRef.current = axis;
//   }, [axis]);

//   useEffect(() => {
//     rangeRef.current = range;
//   }, [range]);

//   useEffect(() => {
//     DeviceMotion.isAvailableAsync().then(setAvailable);

//     DeviceMotion.setUpdateInterval(16);

//     const subscription = DeviceMotion.addListener((data) => {
//       const rotation = data.rotation;
//       if (!rotation) return;

//       const raw = rotation[axisRef.current];
//       if (raw == null || !Number.isFinite(raw)) return;

//       // Expo reports rotation in radians.
//       const degrees = (raw * 180) / Math.PI;
//       const delta = degrees - centerRef.current;

//       // Smooth small sensor fluctuations.
//       smoothRef.current += (delta - smoothRef.current) * 0.25;

//       // Convert the angle to a controller-friendly value.
//       const normalized = Math.max(
//         -1,
//         Math.min(1, smoothRef.current / rangeRef.current)
//       );

//       setAngle(Math.round(normalized * 100));
//     });

//     return () => subscription.remove();
//   }, []);

//   function calibrate() {
//     // The current angle becomes the new center.
//     // For this prototype, recalibrate while holding the phone still.
//     setCenter((previous) => previous);
//     centerRef.current = center + angle * (range / 100);
//     setAngle(0);
//   }

//   function changeAxis(next: Axis) {
//     setAxis(next);
//     axisRef.current = next;
//     smoothRef.current = 0;
//     setAngle(0);
//   }

//   const steeringLabel =
//     angle < -5 ? "LEFT" : angle > 5 ? "RIGHT" : "CENTER";

//   return (
//     <SafeAreaView style={styles.screen}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.eyebrow}>PHONEWHEEL / PROTOTYPE 01</Text>
//         <Text style={styles.title}>Steering Lab</Text>
//         <Text style={styles.subtitle}>
//           Motion input · Live steering telemetry
//         </Text>

//         <View style={styles.card}>
//           <Text style={styles.label}>STEERING INPUT</Text>
//           <Text style={styles.value}>{angle}</Text>
//           <Text style={styles.direction}>{steeringLabel}</Text>

//           <View style={styles.track}>
//             <View style={styles.centerMark} />
//             <View
//               style={[
//                 styles.marker,
//                 {
//                   left: `${(angle + 100) / 2}%`,
//                 },
//               ]}
//             />
//           </View>

//           <View style={styles.scale}>
//             <Text style={styles.muted}>−100 LEFT</Text>
//             <Text style={styles.muted}>RIGHT +100</Text>
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.label}>ROTATION AXIS</Text>
//           <View style={styles.row}>
//             {(["alpha", "beta", "gamma"] as Axis[]).map((item) => (
//               <Pressable
//                 key={item}
//                 onPress={() => changeAxis(item)}
//                 style={[
//                   styles.axisButton,
//                   axis === item && styles.selected,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.axisText,
//                     axis === item && styles.selectedText,
//                   ]}
//                 >
//                   {item.toUpperCase()}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>

//           <Text style={styles.label}>STEERING RANGE: {range}°</Text>
//           <View style={styles.row}>
//             {[20, 35, 45, 60, 90].map((value) => (
//               <Pressable
//                 key={value}
//                 onPress={() => setRange(value)}
//                 style={[
//                   styles.rangeButton,
//                   range === value && styles.selected,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.axisText,
//                     range === value && styles.selectedText,
//                   ]}
//                 >
//                   {value}°
//                 </Text>
//               </Pressable>
//             ))}
//           </View>

//           <Pressable style={styles.primaryButton} onPress={calibrate}>
//             <Text style={styles.primaryText}>CALIBRATE CENTER</Text>
//           </Pressable>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.label}>SENSOR STATUS</Text>
//           <Text style={styles.status}>
//             {available ? "● SENSOR AVAILABLE" : "○ CHECKING SENSOR"}
//           </Text>
//           <Text style={styles.muted}>
//             Selected axis: {axis.toUpperCase()}
//           </Text>
//           <Text style={styles.muted}>
//             Keep the phone still while calibrating.
//           </Text>
//         </View>

//         <Text style={styles.footer}>
//           PHONEWHEEL · BUILD 001 · LOCAL SENSOR TEST
//         </Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#090d12" },
//   content: { padding: 20, gap: 16, paddingVertical: `15%` },
//   eyebrow: {
//     color: "#45e6a0",
//     fontSize: 11,
//     letterSpacing: 2,
//     fontWeight: "700",
//   },
//   title: { color: "#f4f7fb", fontSize: 32, fontWeight: "800" },
//   subtitle: { color: "#929eac", fontSize: 13, marginTop: -10 },
//   card: {
//     backgroundColor: "#131a22",
//     borderColor: "#26323e",
//     borderWidth: 1,
//     borderRadius: 16,
//     padding: 18,
//     gap: 14,
//   },
//   label: {
//     color: "#8c9baa",
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 1.4,
//   },
//   value: {
//     color: "#45e6a0",
//     fontSize: 66,
//     fontWeight: "800",
//     textAlign: "center",
//   },
//   direction: {
//     color: "#f4f7fb",
//     textAlign: "center",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   track: {
//     height: 8,
//     backgroundColor: "#293541",
//     borderRadius: 5,
//     position: "relative",
//     justifyContent: "center",
//   },
//   centerMark: {
//     position: "absolute",
//     left: "50%",
//     height: 18,
//     width: 2,
//     backgroundColor: "#ffffff",
//   },
//   marker: {
//     position: "absolute",
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#45e6a0",
//     marginLeft: -6,
//   },
//   scale: { flexDirection: "row", justifyContent: "space-between" },
//   muted: { color: "#8c9baa", fontSize: 12 },
//   row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
//   axisButton: {
//     flex: 1,
//     minWidth: 75,
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 9,
//     backgroundColor: "#202a35",
//   },
//   rangeButton: {
//     flex: 1,
//     minWidth: 40,
//     alignItems: "center",
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: "#202a35",
//   },
//   selected: { backgroundColor: "#174d3b", borderColor: "#45e6a0", borderWidth: 1 },
//   axisText: { color: "#b8c4d0", fontWeight: "700", fontSize: 12 },
//   selectedText: { color: "#45e6a0" },
//   primaryButton: {
//     backgroundColor: "#45e6a0",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 4,
//   },
//   primaryText: { color: "#07110c", fontWeight: "800", letterSpacing: 1 },
//   status: { color: "#45e6a0", fontWeight: "700", fontSize: 13 },
//   footer: {
//     textAlign: "center",
//     color: "#687582",
//     fontSize: 10,
//     letterSpacing: 1,
//     paddingVertical: 8,
//   },
// });


// import { useEffect, useState } from 'react';
// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { DeviceMotion } from 'expo-sensors';

// export default function App() {
//   const [sensorData, setSensorData] = useState<any>(null);
//   const [available, setAvailable] = useState<boolean | null>(null);

//   useEffect(() => {
//     let subscription: { remove: () => void } | null = null;

//     async function startSensor() {
//       const isAvailable = await DeviceMotion.isAvailableAsync();
//       setAvailable(isAvailable);

//       if (!isAvailable) return;

//       DeviceMotion.setUpdateInterval(50); // Request updates every 50ms

//       subscription = DeviceMotion.addListener((data) => {
//         setSensorData(data);
//       });
//     }

//     startSensor();

//     return () => {
//       subscription?.remove();
//     };
//   }, []);

//   const format = (value: unknown) =>
//     typeof value === 'number' ? value.toFixed(4) : '—';

//   const Section = ({ title, children }: any) => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       {children}
//     </View>
//   );

//   const Value = ({ label, value }: any) => (
//     <View style={styles.row}>
//       <Text style={styles.label}>{label}</Text>
//       <Text style={styles.value}>
//         {typeof value === 'object' && value !== null
//           ? JSON.stringify(value)
//           : format(value)}
//       </Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>Live Device Sensors</Text>

//       <Text style={styles.status}>
//         {available === null
//           ? 'Checking sensor...'
//           : available
//             ? sensorData
//               ? '● LIVE'
//               : 'Waiting for data...'
//             : 'Sensor unavailable'}
//       </Text>

//       <Section title="Rotation (radians)">
//         <Value label="Alpha" value={sensorData?.rotation?.alpha} />
//         <Value label="Beta" value={sensorData?.rotation?.beta} />
//         <Value label="Gamma" value={sensorData?.rotation?.gamma} />
//       </Section>

//       <Section title="Orientation">
//         <Value label="Device Orientation" value={sensorData?.orientation} />
//       </Section>

//       <Section title="Rotation Rate (rad/s)">
//         <Value label="Alpha" value={sensorData?.rotationRate?.alpha} />
//         <Value label="Beta" value={sensorData?.rotationRate?.beta} />
//         <Value label="Gamma" value={sensorData?.rotationRate?.gamma} />
//       </Section>

//       <Section title="Acceleration (m/s²)">
//         <Value label="X" value={sensorData?.acceleration?.x} />
//         <Value label="Y" value={sensorData?.acceleration?.y} />
//         <Value label="Z" value={sensorData?.acceleration?.z} />
//       </Section>

//       <Section title="Acceleration Including Gravity (m/s²)">
//         <Value label="X" value={sensorData?.accelerationIncludingGravity?.x} />
//         <Value label="Y" value={sensorData?.accelerationIncludingGravity?.y} />
//         <Value label="Z" value={sensorData?.accelerationIncludingGravity?.z} />
//       </Section>

//       <Section title="Raw Event Data">
//         <Text style={styles.raw}>
//           {sensorData ? JSON.stringify(sensorData, null, 2) : 'No data yet'}
//         </Text>
//       </Section>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#101010',
//     paddingHorizontal: 16,
//   },
//   heading: {
//     color: '#ffffff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 55,
//     marginBottom: 8,
//   },
//   status: {
//     color: '#4ade80',
//     fontSize: 13,
//     marginBottom: 18,
//   },
//   section: {
//     marginBottom: 18,
//     padding: 12,
//     backgroundColor: '#1c1c1c',
//     borderRadius: 8,
//   },
//   sectionTitle: {
//     color: '#a3a3a3',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   label: {
//     color: '#d4d4d4',
//     fontSize: 14,
//   },
//   value: {
//     color: '#67e8f9',
//     fontSize: 14,
//     fontVariant: ['tabular-nums'],
//   },
//   raw: {
//     color: '#67e8f9',
//     fontSize: 11,
//     lineHeight: 17,
//   },
// });




import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

const MIN_RANGE = 15;
const MAX_RANGE = 90;
const WS_URL = 'ws://192.168.0.147:8080';

export default function App() {
  const [beta, setBeta] = useState<number | null>(null);
  const [center, setCenter] = useState(0);
  const [range, setRange] = useState(85);
  const [connected, setConnected] = useState(false);
  const [throttle, setThrottle] = useState(0);
  const [brake, setBrake] = useState(0);

  const socket = useRef<WebSocket | null>(null);
  const controls = useRef({ steering: 0, throttle: 0, brake: 0 });

  const offset = beta === null ? 0 : beta - center;
  const steering = Math.max(-100, Math.min(100, (offset / range) * 100));

  useEffect(() => {
    DeviceMotion.setUpdateInterval(16);

    const subscription = DeviceMotion.addListener((data) => {
      const value = data.rotation?.beta;
      if (typeof value === 'number') {
        setBeta(value * (180 / Math.PI));
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    socket.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
      if (socket.current === ws) socket.current = null;
    };
  }, []);

  useEffect(() => {
    controls.current.steering = steering;
  }, [steering]);

  useEffect(() => {
    controls.current.throttle = throttle;
  }, [throttle]);

  useEffect(() => {
    controls.current.brake = brake;
  }, [brake]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ws = socket.current;

      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(controls.current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const calibrate = () => {
    if (beta !== null) setCenter(beta);
  };

  const adjustRange = (amount: number) => {
    setRange((current) =>
      Math.max(MIN_RANGE, Math.min(MAX_RANGE, current + amount))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>PHONE WHEEL</Text>

      <Text style={{ color: connected ? '#4ade80' : '#f87171' }}>
        {connected ? '● PC CONNECTED' : '○ PC DISCONNECTED'}
      </Text>

      <Text style={styles.label}>STEERING</Text>
      <Text style={styles.steering}>{steering.toFixed(0)}%</Text>

      <View style={styles.track}>
        <View style={styles.centerLine} />
        <View style={[styles.marker, { left: `${(steering + 100) / 2}%` }]} />
      </View>

      <View style={styles.readings}>
        <Text style={styles.reading}>
          Beta: {beta === null ? '--' : `${beta.toFixed(1)}°`}
        </Text>
        <Text style={styles.reading}>Offset: {offset.toFixed(1)}°</Text>
      </View>

      <Pressable style={styles.button} onPress={calibrate}>
        <Text style={styles.buttonText}>Calibrate Center</Text>
      </Pressable>

      <Text style={styles.label}>STEERING RANGE: ±{range}°</Text>

      <View style={styles.rangeControls}>
        <Pressable style={styles.smallButton} onPress={() => adjustRange(-5)}>
          <Text style={styles.buttonText}>− 5°</Text>
        </Pressable>
        <Pressable style={styles.smallButton} onPress={() => adjustRange(5)}>
          <Text style={styles.buttonText}>+ 5°</Text>
        </Pressable>
      </View>

      <View style={styles.pedals}>
        <Pressable
          style={({ pressed }) => [
            styles.pedal,
            styles.brakePedal,
            pressed && styles.pedalPressed,
          ]}
          onPressIn={() => setBrake(100)}
          onPressOut={() => setBrake(0)}
          accessibilityLabel="Hold to brake"
        >
          <Text style={styles.pedalEmoji}>■</Text>
          <Text style={styles.pedalText}>BRAKE</Text>
          <Text style={styles.pedalStatus}>{brake ? 'ACTIVE' : 'HOLD'}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.pedal,
            styles.accelPedal,
            pressed && styles.pedalPressed,
          ]}
          onPressIn={() => setThrottle(100)}
          onPressOut={() => setThrottle(0)}
          accessibilityLabel="Hold to accelerate"
        >
          <Text style={styles.pedalEmoji}>▲</Text>
          <Text style={styles.pedalText}>ACCEL</Text>
          <Text style={styles.pedalStatus}>{throttle ? 'ACTIVE' : 'HOLD'}</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        Hold the phone in your neutral driving position, then calibrate.
        Hold ACCEL to accelerate and BRAKE to brake.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    color: '#999',
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 24,
  },
  label: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 20,
  },
  steering: {
    color: '#67e8f9',
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginVertical: 18,
    position: 'relative',
    justifyContent: 'center',
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: 18,
    backgroundColor: '#777',
  },
  marker: {
    position: 'absolute',
    width: 12,
    height: 18,
    marginLeft: -6,
    borderRadius: 4,
    backgroundColor: '#67e8f9',
  },
  readings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reading: {
    color: '#ddd',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#164e63',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 22,
  },
  rangeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },
  smallButton: {
    backgroundColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  pedals: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 28,
  },
  pedal: {
    flex: 1,
    minHeight: 105,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 2,
    borderColor: '#ffffff25',
  },
  brakePedal: {
    backgroundColor: '#7f1d1d',
  },
  accelPedal: {
    backgroundColor: '#166534',
  },
  pedalPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.97 }],
    borderColor: '#fff',
  },
  pedalEmoji: {
    color: '#fff',
    fontSize: 20,
  },
  pedalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pedalStatus: {
    color: '#ffffffbb',
    fontSize: 10,
    letterSpacing: 2,
  },
  hint: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
});
