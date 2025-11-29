"use client";

interface StoryLine {
  text: string;
  author: string;
  lineNumber: number;
}

interface StoryDisplayProps {
  lines: string[];
  authors: string[];
  maxLines?: number;
}

export const StoryDisplay = ({ lines = [], authors = [], maxLines = 10 }: StoryDisplayProps) => {
  // Create array of all 10 slots, filled or empty
  const storySlots: (StoryLine | null)[] = Array.from({ length: maxLines }, (_, index) => {
    if (index < lines.length) {
      return {
        text: lines[index],
        author: authors[index] || "0x0000",
        lineNumber: index + 1,
      };
    }
    return null;
  });

  const truncateAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isComplete = lines.length >= maxLines;

  return (
    <div className="w-full">
      {/* Story Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span>📖</span>
          <span>The Story</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="text-sm font-mono bg-base-200 px-4 py-2 rounded-full">
            {lines.length}/{maxLines} lines
          </div>
          {isComplete && (
            <div className="badge badge-success badge-lg gap-2">
              <span>✓</span> Complete
            </div>
          )}
        </div>
      </div>

      {/* Story Container */}
      <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-3xl shadow-2xl p-8 border-2 border-base-300">
        <div className="space-y-4">
          {storySlots.map((slot, index) => (
            <div key={index} className={`group transition-all duration-300 ${slot ? "opacity-100" : "opacity-40"}`}>
              <div className="flex gap-4 items-start">
                {/* Line Number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-h-[3rem] flex flex-col justify-center">
                  {slot ? (
                    <>
                      <p className="text-lg leading-relaxed mb-2">{slot.text}</p>
                      <div className="flex items-center gap-2 text-sm opacity-60">
                        <span className="font-mono">{truncateAddress(slot.author)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-base-content/30">
                      <span className="text-2xl">─────────────────</span>
                      <span className="text-sm italic">waiting for contribution</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Separator (except last line) */}
              {index < maxLines - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent my-3" />
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-8 text-center p-6 bg-success/10 rounded-2xl border-2 border-success/30">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Story Complete!</h3>
            <p className="text-base-content/70">A collaborative masterpiece created by {authors.length} contributors</p>
          </div>
        )}
      </div>
    </div>
  );
};
