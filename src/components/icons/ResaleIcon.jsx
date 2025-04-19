import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/tag.json';

export default function ResaleIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 90, width: 90 }}
    />
  );
}
