import { MapboxProvider } from "../../context/mapContext";

const MainMap = ({children,config}) => {
  return (
    <MapboxProvider config={config}>
      {/* Other components that need access to the map */}
      { children }
    </MapboxProvider>
  );
};

export default MainMap;
