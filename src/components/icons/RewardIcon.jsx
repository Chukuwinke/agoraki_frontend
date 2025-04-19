import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../../assets/lottie/reward.json';

export default function RewardIcon() {
  return (
    <Player
      autoplay
      loop
      src={animationData}
      style={{ height: 90, width: 90 }}
    />
  );
}
