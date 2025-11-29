"use client";

import { useState } from "react";

interface StoryInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  isComplete: boolean;
  currentLineCount: number;
  maxLines: number;
}

export const StoryInput = ({ onSubmit, isLoading, isComplete, currentLineCount, maxLines }: StoryInputProps) => {
  const [text, setText] = useState("");
  const maxChars = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && text.length <= maxChars) {
      onSubmit(text.trim());
      setText("");
    }
  };

  if (isComplete) {
    return (
      <div className="w-full bg-base-200 rounded-3xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-xl font-bold mb-2">Story Complete</h3>
        <p className="text-base-content/60">
          This story has reached its 10-line conclusion. Thank you for being part of it!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-base-100 rounded-3xl shadow-xl p-8 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">✍️</span>
          <div>
            <h3 className="text-2xl font-bold">Add Your Line</h3>
            <p className="text-sm text-base-content/60">
              Contribute to line #{currentLineCount + 1} of {maxLines}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Input */}
          <div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write your contribution to the story... (one sentence)"
              className="textarea textarea-bordered textarea-lg w-full min-h-[120px] text-lg focus:textarea-primary"
              maxLength={maxChars}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-sm text-base-content/50">
                {text.length}/{maxChars} characters
              </span>
              {text.length > maxChars * 0.9 && (
                <span className="text-sm text-warning">{maxChars - text.length} left</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full text-lg gap-2"
            disabled={!text.trim() || text.length > maxChars || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Submitting to blockchain...
              </>
            ) : (
              <>
                <span>📝</span>
                Add Line to Story
              </>
            )}
          </button>

          {/* Helper Text */}
          <div className="text-center text-sm text-base-content/50">
            <p>✨ Your contribution will be immortalized on the blockchain</p>
            <p className="mt-1">⚡ Monad&apos;s 1-second blocks = instant publishing</p>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-4 bg-info/10 rounded-2xl p-4 border border-info/20">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="font-bold mb-1">Writing Tips</h4>
            <ul className="text-sm space-y-1 text-base-content/70">
              <li>• Build on the previous lines naturally</li>
              <li>• Keep it engaging - others will continue your thread</li>
              <li>• One sentence is perfect, but feel free to add more</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
