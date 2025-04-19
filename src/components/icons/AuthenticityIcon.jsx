import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/authentication.json';

export default function AuthenticityIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 90, width: 90 }}
    />
  );
}
