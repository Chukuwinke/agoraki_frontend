import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/scan.json';

export default function TagIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 100, width: 100 }}
    />
  );
}
