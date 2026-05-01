export type AIModel = "claude" | "gemini" | "chatgpt";

interface PromptInput {
  courseName: string;
  subtopic: string;
  timeLabel: string;
  model: AIModel;
}

const modelNames: Record<AIModel, string> = {
  claude: "Claude",
  gemini: "Gemini",
  chatgpt: "ChatGPT",
};

export function generatePrompt({
  courseName,
  subtopic,
  timeLabel,
  model,
}: PromptInput): string {
  const modelName = modelNames[model];

  return `I am an A-level student studying ${courseName}. I need to revise the topic "${subtopic}" and I have ${timeLabel} left to revise.

Please create a structured revision plan and study material for me that includes:

1. **Key Concepts Summary** — A concise overview of the most important ideas, definitions, and principles I need to know for "${subtopic}".

2. **Detailed Notes** — Clear, exam-focused explanations of each key concept, broken down into manageable sections appropriate for my ${timeLabel} timeframe.

3. **Common Exam Questions** — Examples of the types of questions that typically appear in A-level ${courseName} exams on this topic, with model answer outlines.

4. **Quick-Fire Recall Questions** — 10 short-answer questions I can use to test myself.

5. **Exam Technique Tips** — Specific advice on how to structure answers and gain marks for "${subtopic}" in A-level ${courseName}.

6. **Revision Timetable** — A suggested schedule for how to spread my revision across the ${timeLabel} I have available, including breaks and active recall sessions.

Please tailor everything to the UK A-level ${courseName} specification and make sure the content is accurate, exam-relevant, and easy to follow. Use bullet points and headers to keep it scannable.`;
}

export function getModelUrl(model: AIModel, prompt?: string): string {
  const encoded = prompt ? encodeURIComponent(prompt) : "";
  switch (model) {
    case "claude":
      return prompt
        ? `https://claude.ai/new?q=${encoded}`
        : "https://claude.ai/new";
    case "gemini":
      return prompt
        ? `https://gemini.google.com/app?q=${encoded}`
        : "https://gemini.google.com/";
    case "chatgpt":
      return prompt
        ? `https://chatgpt.com/?q=${encoded}`
        : "https://chatgpt.com/";
  }
}

export function getModelColor(model: AIModel): string {
  switch (model) {
    case "claude":
      return "from-orange-500 to-amber-500";
    case "gemini":
      return "from-blue-500 to-cyan-500";
    case "chatgpt":
      return "from-emerald-500 to-green-500";
  }
}
