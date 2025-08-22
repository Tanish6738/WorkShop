import KeyFeatures from './KeyFeatures';
import HowItWorks from './HowItWorks';
import WhyPromptVault from './WhyPromptVault';
import SocialProofVision from './SocialProofVision';
import CTASection from './CTASection';

export { KeyFeatures, HowItWorks, WhyPromptVault, SocialProofVision, CTASection };

export default function Sections() {
	return (
		<>
			<KeyFeatures />
			<HowItWorks />
			<WhyPromptVault />
			<SocialProofVision />
			<CTASection />
		</>
	);
}
