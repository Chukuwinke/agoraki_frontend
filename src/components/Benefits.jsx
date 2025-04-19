import AuthenticityIcon from './icons/AuthenticityIcon';
import ResaleIcon      from './icons/ResaleIcon';
import RewardIcon      from './icons/RewardIcon';

export default function Benefits() {
  return (
    <section className="benefits grid">
      <div>
        <AuthenticityIcon />
        <h3>Authenticity You Can Trust</h3>
        <p>1:1 NFT twins ensure no fakes.</p>
      </div>
      <div>
        <ResaleIcon />
        <h3>Sell & Resell Securely</h3>
        <p>Immutable provenance on every transaction.</p>
      </div>
      <div>
        <RewardIcon />
        <h3>Earn & Engage</h3>
        <p>Gamified loyalty rewards powered by Ambrosia.</p>
      </div>
    </section>
  );
}
