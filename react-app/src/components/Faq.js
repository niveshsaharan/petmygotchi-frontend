/* This example requires Tailwind CSS v2.0+ */
import { TELEGRAM_ID } from "../constants";
import { ethers } from "ethers";

export default function Faq(props) {
  const feePerPetPerDay =
    typeof props.feePerPetPerDay !== "undefined" ? `${ethers.utils.formatEther(props.feePerPetPerDay || 0)} MATIC` : ``;

  const faqs = [
    {
      id: 1,
      question: "Does petting work when my gotchi's are rented out?",
      answer: "Yes, it does.",
    },
    {
      id: 2,
      question: "How much does it cost if I have 5 or 10 or more gotchi's?",
      answer: "It costs " + feePerPetPerDay + " for each of your gotchi. ",
    },
    {
      id: 3,
      question: "What time is my gotchi petted?",
      answer: "As soon as 12 hours have passed since the last pet.",
    },
    {
      id: 4,
      question: "Is there any risk in using Pet My Gotchi?",
      answer:
        "No, It uses Set Pet Operator ability of Aavegotchi smart contract and the only thing we can do with that is pet your gotchi's.",
    },
    {
      id: 5,
      question: "What's the difference in Upgradable, Non-Upgradable and Oldest versions?",
      answer: [
        "Non-Upgradable: As the name suggest, the contract cannot be upgraded and no new features can be added.",
        "Upgradable: Allows us to add features from time to time and you should only use if you really trust us.",
        "Oldest: is the initial version and no longer maintained. If you are using it, we request you to cancel from there and use one of Upgradable or Non-Upgradable version.",
      ],
    },
    // More questions...
  ];

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:mx-auto lg:text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-gray-500">
            Questions. Frequently asked ones. Plus our answers. That's how FAQs work. If you can't find what you're
            looking for, you can always{" "}
            <a className={`text-purple-500`} target={`_blank`} href={"https://t.me/" + TELEGRAM_ID}>
              message us
            </a>{" "}
            with your enquiry.
          </p>
        </div>
        <div className="mt-16">
          <dl className="space-y-10 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10 lg:space-y-0">
            {faqs.map(faq => (
              <div key={faq.id}>
                <dt className="font-semibold text-gray-900">{faq.question}</dt>
                <dd className="mt-3 text-gray-500">
                  {Array.isArray(faq.answer)
                    ? faq.answer.map((answer, i) => (
                        <p className={`mt-2`} key={i}>
                          {answer}
                        </p>
                      ))
                    : faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
