import { PricingCard } from "components/pricing";
import styled from "@emotion/styled";
import plans_live from "k/plans.json";
import plans_test from "k/plans.test.json";
import contacts from "k/contacts.json";
import faqs from "k/faq.json";
import { motion } from "framer-motion";
import { FaqItem } from "@/components/faq";

const plans = process.env.NODE_ENV === "production" ? plans_live : plans_test;

const price_size = {
  normal: { width: 220 } as const,
  highlighted: { width: 234, height: 340 } as const,
} as const;

export function UpgradeToProPlansView({
  onUpgradeClick,
}: {
  onUpgradeClick?: (price: string) => void;
}) {
  return (
    <PlansViewWrapper>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        Upgrade to Pro
      </motion.h1>
      <motion.section
        className="pricing-table"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
                  onUpgradeClick?.(plans.personal.id);
                }}
              >
                Get Started
              </button>
            }
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
                  onUpgradeClick?.(plans.team.id);
                }}
              >
                Get Started
              </button>
            }
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
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
        </motion.div>
      </motion.section>
      <div
        style={{
          marginTop: 40,
        }}
      />
      <motion.section
        className="faq section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          className="list"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {faqs.map((_, i) => (
            <FaqItem key={i} {..._} />
          ))}
        </motion.div>
      </motion.section>
    </PlansViewWrapper>
  );
}

const PlansViewWrapper = styled.div`
  font-family: "Inter", sans-serif;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .pricing-table {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }

  section {
    width: 100%;
  }
`;
