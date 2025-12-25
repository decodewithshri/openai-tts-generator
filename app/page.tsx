import TextToSpeechForm from "@/components/text-to-speech-form";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <main className="w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            OpenAI Text-to-Speech
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your words into lifelike speech with cutting-edge AI technology
          </p>
        </div>
        <TextToSpeechForm />
      </main>
    </div>
  );
}
