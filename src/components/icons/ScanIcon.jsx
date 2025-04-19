import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/barcode.json';

export default function ScanIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 100, width: 150 }}
    />
  );
}
