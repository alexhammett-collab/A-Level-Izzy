"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Search,
  GraduationCap,
} from "lucide-react";
import { courses, timeOptions } from "@/data/courses";
import {
  generatePrompt,
  getModelUrl,
  getModelColor,
  type AIModel,
} from "@/lib/generatePrompt";

const steps = [
  { id: 1, label: "Subject", icon: BookOpen },
  { id: 2, label: "Topic", icon: GraduationCap },
  { id: 3, label: "Time", icon: Clock },
  { id: 4, label: "Prompt", icon: Sparkles },
];

const aiModels: { id: AIModel; name: string; icon: string }[] = [
  { id: "claude", name: "Claude", icon: "🟠" },
  { id: "chatgpt", name: "ChatGPT", icon: "🟢" },
  { id: "gemini", name: "Gemini", icon: "🔵" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>("claude");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const course = useMemo(
    () => courses.find((c) => c.id === selectedCourse),
    [selectedCourse]
  );

  const timeOption = useMemo(
    () => timeOptions.find((t) => t.id === selectedTime),
    [selectedTime]
  );

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter((c) => c.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const prompt = useMemo(() => {
    if (!course || !selectedSubtopic || !timeOption) return "";
    return generatePrompt({
      courseName: course.name,
      subtopic: selectedSubtopic,
      timeLabel: timeOption.label,
      model: selectedModel,
    });
  }, [course, selectedSubtopic, timeOption, selectedModel]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedCourse;
      case 2:
        return !!selectedSubtopic;
      case 3:
        return !!selectedTime;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (canGoNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(1);
    setSelectedCourse(null);
    setSelectedSubtopic(null);
    setSelectedTime(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                A-Level Prompt Builder
              </h1>
              <p className="text-xs text-slate-500">
                Generate revision prompts for AI assistants
              </p>
            </div>
          </div>
          {currentStep > 1 && (
            <button
              onClick={reset}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        isActive
                          ? "text-slate-900"
                          : isCompleted
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 ${
                        isCompleted ? "bg-emerald-300" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Step 1: Select Course */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Choose your A-Level subject
              </h2>
              <p className="text-slate-500">
                Select the subject you want to revise
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourse(c.id);
                    setSelectedSubtopic(null);
                    setCurrentStep(2);
                  }}
                  className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedCourse === c.id
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-violet-300"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{c.icon}</span>
                  <span className="text-sm font-semibold text-slate-800 block leading-tight">
                    {c.name}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {c.subtopics.length} topics
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Subtopic */}
        {currentStep === 2 && course && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                <span className="mr-2">{course.icon}</span>
                {course.name} — Pick a topic
              </h2>
              <p className="text-slate-500">
                Choose the specific topic you want to focus on
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.subtopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setSelectedSubtopic(topic);
                    setCurrentStep(3);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedSubtopic === topic
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-violet-300"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800">
                    {topic}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                How much revision time do you have?
              </h2>
              <p className="text-slate-500">
                This helps tailor the depth and structure of your revision plan
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTime(t.id);
                    setCurrentStep(4);
                  }}
                  className={`p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selectedTime === t.id
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-violet-300"
                  }`}
                >
                  <Clock
                    className={`w-5 h-5 mb-2 ${
                      selectedTime === t.id
                        ? "text-violet-500"
                        : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-800 block">
                    {t.label}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Generated Prompt */}
        {currentStep === 4 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Your revision prompt is ready!
              </h2>
              <p className="text-slate-500">
                Copy the prompt below and paste it into your preferred AI
                assistant
              </p>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                {course?.name}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                <GraduationCap className="w-3.5 h-3.5" />
                {selectedSubtopic}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-medium">
                <Clock className="w-3.5 h-3.5" />
                {timeOption?.label}
              </span>
            </div>

            {/* AI Model selector */}
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Choose your AI model
              </label>
              <div className="flex gap-2">
                {aiModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                      selectedModel === m.id
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                    }`}
                  >
                    <span>{m.icon}</span>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt output */}
            <div className="relative rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-600">
                  Generated Prompt
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy prompt
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto font-sans">
                {prompt}
              </pre>
            </div>

            {/* Open in AI link */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 bg-gradient-to-r ${getModelColor(
                  selectedModel
                )} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
              >
                <Copy className="w-5 h-5" />
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
              <a
                href={getModelUrl(selectedModel)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5" />
                Open{" "}
                {aiModels.find((m) => m.id === selectedModel)?.name}
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      {currentStep < 4 && (
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentStep === 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-sm text-slate-400">
              Step {currentStep} of 4
            </div>

            <button
              onClick={goNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                canGoNext()
                  ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400">
          Built to help A-Level students revise smarter with AI
        </div>
      </footer>
    </div>
  );
}
