import { PricingCard } from "components/pricing";
import plans from "k/plans.json";
import contacts from "k/contacts.json";

const price_size = {
  normal: { width: 220 } as const,
  highlighted: { width: 234, height: 340 } as const,
} as const;

export function UpgradeToProPlansView() {
  return (
    <>
      <div>
        <PricingCard
          style={price_size.normal}
          plan="Personal"
          price={{
            value: plans.personal.price.value,
            currency: plans.personal.price.symbol,
            unit: "/Mo",
          }}
          unit={{
            value: 250,
            unit: "Images",
          }}
          desc={"$0.020 per Image"}
          action={
            <button
              onClick={() => {
                open(plans.personal.link);
              }}
            >
              Get Started
            </button>
          }
        />
        <PricingCard
          style={price_size.highlighted}
          plan="Team"
          price={{
            value: plans.team.price.value,
            currency: plans.team.price.symbol,
            unit: "/Mo",
          }}
          unit={{
            value: 1250,
            unit: "Images",
          }}
          desc={"$0.020 per Image"}
          action={
            <button
              onClick={() => {
                open(plans.team.link);
              }}
            >
              Get Started
            </button>
          }
        />
        <PricingCard
          style={price_size.normal}
          plan="Business"
          price={{
            value: 300,
            currency: "$",
            unit: "/Mo",
          }}
          desc={"Custom Templates & API Access"}
          action={
            <button
              onClick={() => {
                open(contacts.demo);
              }}
            >
              Contact Sales
            </button>
          }
        />
      </div>
    </>
  );
}
