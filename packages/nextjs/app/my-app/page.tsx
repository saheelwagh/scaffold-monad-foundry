"use client";

import { useState } from "react";
import { StoryDisplay } from "./_components/StoryDisplay";
import { StoryInput } from "./_components/StoryInput";
import { StoryRevenue } from "./_components/StoryRevenue";
import type { NextPage } from "next";

const MyApp: NextPage = () => {
  // Demo/Mock state - will be replaced with contract hooks in Hour 3
  const [demoLines, setDemoLines] = useState<string[]>([
    "Once upon a time, in a blockchain far, far away...",
    "A group of brave developers decided to build something magical.",
    "They chose Monad for its lightning-fast 1-second blocks.",
  ]);
  const [demoAuthors, setDemoAuthors] = useState<string[]>(["0x1234...5678", "0xabcd...ef01", "0x9876...4321"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  const MAX_LINES = 10;
  const isComplete = demoLines.length >= MAX_LINES;

  // Mock handlers - will connect to contract in Hour 3
  const handleAddLine = async (text: string) => {
    setIsSubmitting(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDemoLines([...demoLines, text]);
    setDemoAuthors([...demoAuthors, "0xDemo...User"]);
    setIsSubmitting(false);
  };

  const handleDonate = async (amount: string) => {
    setIsDonating(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Donated ${amount} MON`);
    setIsDonating(false);
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10 pb-10">
        <div className="px-5 w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Mon ki baat 📖
            </h1>
            <p className="text-2xl text-base-content/70 mb-2">Collaborative Storytelling on Monad</p>
            <p className="text-lg text-base-content/50">
              Build a story together, one sentence at a time. Complete 10 lines to share the rewards.
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Story Display (2/3 width) */}
            <div className="lg:col-span-2">
              <StoryDisplay lines={demoLines} authors={demoAuthors} maxLines={MAX_LINES} />

              {/* Story Input */}
              <div className="mt-8">
                <StoryInput
                  onSubmit={handleAddLine}
                  isLoading={isSubmitting}
                  isComplete={isComplete}
                  currentLineCount={demoLines.length}
                  maxLines={MAX_LINES}
                />
              </div>
            </div>

            {/* Right Column - Revenue & Info (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <StoryRevenue
                contractBalance="0.42"
                onDonate={handleDonate}
                isLoading={isDonating}
                isComplete={isComplete}
                contributorsCount={demoAuthors.length}
              />

              {/* How It Works */}
              <div className="bg-base-100 rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Why Monad?</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="text-primary text-lg">✓</span>
                    <div>
                      <div className="font-semibold">1-Second Blocks</div>
                      <div className="text-base-content/60">
                        Your contribution appears instantly, like a real chat app
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary text-lg">✓</span>
                    <div>
                      <div className="font-semibold">Low Gas Fees</div>
                      <div className="text-base-content/60">Auto-distribution to 10 people is actually viable</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary text-lg">✓</span>
                    <div>
                      <div className="font-semibold">Instant Payouts</div>
                      <div className="text-base-content/60">When line #10 hits, everyone gets paid immediately</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats stats-vertical shadow-xl w-full">
                <div className="stat">
                  <div className="stat-title">Contributors</div>
                  <div className="stat-value text-primary">{demoAuthors.length}</div>
                  <div className="stat-desc">Unique addresses</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Progress</div>
                  <div className="stat-value text-secondary">{Math.round((demoLines.length / MAX_LINES) * 100)}%</div>
                  <div className="stat-desc">{MAX_LINES - demoLines.length} lines remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-base-content/50">
            <p>Built with ❤️ on Monad | Powered by Scaffold-ETH</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyApp;
