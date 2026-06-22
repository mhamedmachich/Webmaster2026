import { C } from "../data/colors";
import AIChat from "../components/ai/AIChat";
import PageHero from "../components/layout/PageHero";

export default function AIPage() {
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Community Resource Guide" subtitle="Describe what you need and get a practical local starting point." color={C.teal} end="#085041" icon="guide" />
      <div style={{ maxWidth:750, margin:"0 auto", padding:"48px 24px" }}>
        <AIChat />
        <div style={{ marginTop:14, textAlign:"center", fontSize:12, color:C.g400 }}>
          Informational guidance only · verify resources before real-world use
        </div>
      </div>
    </div>
  );
}
