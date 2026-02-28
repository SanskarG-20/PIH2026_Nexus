import Ticker from "../components/Ticker";
import { Y, BK, WH } from "../constants/theme";

export default function TickerSection() {
  const t1 = [
    "AI TRAVEL PLANNING",
    "REAL-TIME GPS",
    "WEATHER AWARE",
    "BUDGET SMART",
    "MUMBAI FIRST",
    "WOMEN SAFETY",
  ];
  const t2 = [
    "INTENT-BASED AI",
    "CROWD SIGNALS",
    "AQI MONITOR",
    "EXPLAINABLE AI",
    "OFFLINE MODE",
    "SOS EMERGENCY",
  ];

  return (
    <div>
      <Ticker items={t1} bg={BK} color={WH} speed={25} />
      <Ticker items={t2} reverse bg={Y} color={BK} speed={20} />
    </div>
  );
}
