"use client";

import { useState } from "react";

interface StoryRevenueProps {
  contractBalance: string;
  onDonate: (amount: string) => void;
  isLoading: boolean;
  isComplete: boolean;
  contributorsCount: number;
}

export const StoryRevenue = ({
  contractBalance,
  onDonate,
  isLoading,
  isComplete,
  contributorsCount,
}: StoryRevenueProps) => {
  const [donationAmount, setDonationAmount] = useState("0.01");

  const handleDonate = () => {
    if (parseFloat(donationAmount) > 0) {
      onDonate(donationAmount);
    }
  };

  const presetAmounts = ["0.01", "0.05", "0.1", "0.5"];

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-3xl shadow-xl p-8 border-2 border-success/30">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">💰</span>
          <div>
            <h3 className="text-2xl font-bold">Story Revenue</h3>
            <p className="text-sm text-base-content/60">Support the contributors</p>
          </div>
        </div>

        {/* Contract Balance Display */}
        <div className="bg-base-100 rounded-2xl p-6 mb-6 text-center">
          <div className="text-sm text-base-content/60 mb-2">Total Backing</div>
          <div className="text-5xl font-bold text-success mb-2">{contractBalance}</div>
          <div className="text-lg text-base-content/60">MON</div>

          {isComplete && contributorsCount > 0 && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="text-sm text-base-content/60">Share per contributor</div>
              <div className="text-2xl font-bold text-primary">
                {(parseFloat(contractBalance || "0") / contributorsCount).toFixed(4)} MON
              </div>
            </div>
          )}
        </div>

        {/* Donation Section */}
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Back this story</span>
            </label>

            {/* Preset Amounts */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                  className={`btn btn-sm ${donationAmount === amount ? "btn-primary" : "btn-outline"}`}
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="0.00"
                disabled={isLoading}
              />
              <span className="flex items-center px-4 bg-base-200 rounded-lg font-mono">MON</span>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            className="btn btn-success btn-lg w-full text-lg gap-2"
            disabled={!parseFloat(donationAmount) || parseFloat(donationAmount) <= 0 || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <span>🎁</span>
                Donate {donationAmount} MON
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="bg-base-100/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm space-y-2">
                {!isComplete ? (
                  <>
                    <p className="font-semibold">How it works:</p>
                    <ul className="space-y-1 text-base-content/70">
                      <li>• Donations are held in the contract</li>
                      <li>• When the 10th line is added, funds auto-distribute</li>
                      <li>• Each contributor receives an equal share</li>
                      <li>• Distribution happens instantly on Monad ⚡</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-success">Story Complete!</p>
                    <p className="text-base-content/70">
                      Funds have been distributed to all {contributorsCount} contributors
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
