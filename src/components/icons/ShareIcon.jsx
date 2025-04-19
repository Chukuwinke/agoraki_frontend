import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/share.json';

export default function ShareIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 100, width: 100 }}
    />
  );
}
