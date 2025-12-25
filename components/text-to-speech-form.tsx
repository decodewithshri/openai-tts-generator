"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, Volume2 } from "lucide-react";

export default function TextToSpeechForm() {
    const [text, setText] = useState("");
    const [voice, setVoice] = useState("alloy");
    const [model, setModel] = useState("tts-1");
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isFinalized, setIsFinalized] = useState(false);

    const maxCharacters = 4096;
    const remainingChars = maxCharacters - text.length;

    const voices = [
        { value: "alloy", label: "Alloy" },
        { value: "echo", label: "Echo" },
        { value: "fable", label: "Fable" },
        { value: "onyx", label: "Onyx" },
        { value: "nova", label: "Nova" },
        { value: "shimmer", label: "Shimmer" },
    ];

    const models = [
        { value: "tts-1", label: "Standard (tts-1)" },
        { value: "tts-1-hd", label: "HD (tts-1-hd)" },
    ];

    const handlePreview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) {
            toast.error("Please enter some text to convert to speech");
            return;
        }

        if (text.length > maxCharacters) {
            toast.error(`Text exceeds maximum length of ${maxCharacters} characters`);
            return;
        }

        setIsLoading(true);
        setIsFinalized(false);

        // Clean up previous audio URL
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }

        try {
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, voice, model }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate speech");
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            toast.success("Preview generated! Listen and finalize when ready.");
        } catch (error: any) {
            console.error("Error generating speech:", error);
            toast.error(error.message || "Failed to generate speech");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalize = () => {
        if (!audioUrl) return;
        setIsFinalized(true);
        toast.success("Audio finalized! You can now download your MP3.");
    };

    const handleDownload = () => {
        if (!audioUrl || !isFinalized) return;

        const a = document.createElement("a");
        a.href = audioUrl;
        a.download = `speech-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("MP3 downloaded!");
    };

    return (
        <Card className="w-full max-w-3xl shadow-xl border-2">
            <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                    <Volume2 className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Text-to-Speech Generator
                    </CardTitle>
                </div>
                <CardDescription className="text-base">
                    Convert your text into natural-sounding speech using OpenAI&apos;s advanced AI voices
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handlePreview} className="space-y-6">
                    {/* Text Input */}
                    <div className="space-y-2">
                        <label htmlFor="text" className="text-sm font-medium">
                            Enter Text
                        </label>
                        <Textarea
                            id="text"
                            placeholder="Type or paste the text you want to convert to speech..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[200px] resize-none text-base"
                            disabled={isLoading}
                        />
                        <p className={`text-sm text-right ${remainingChars < 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                            {remainingChars < 0 ? `${Math.abs(remainingChars)} characters over limit` : `${remainingChars} characters remaining`}
                        </p>
                    </div>

                    {/* Voice and Model Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="voice" className="text-sm font-medium">
                                Voice
                            </label>
                            <Select value={voice} onValueChange={setVoice} disabled={isLoading}>
                                <SelectTrigger id="voice">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {voices.map((v) => (
                                        <SelectItem key={v.value} value={v.value}>
                                            {v.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="model" className="text-sm font-medium">
                                Quality
                            </label>
                            <Select value={model} onValueChange={setModel} disabled={isLoading}>
                                <SelectTrigger id="model">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Generate Preview Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full text-base font-semibold"
                        disabled={isLoading || !text.trim() || text.length > maxCharacters}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Preview...
                            </>
                        ) : (
                            <>
                                <Volume2 className="mr-2 h-5 w-5" />
                                {audioUrl && !isFinalized ? "Regenerate Preview" : "Generate Preview"}
                            </>
                        )}
                    </Button>
                </form>

                {/* Preview Audio Player and Finalize */}
                {audioUrl && !isFinalized && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                Preview Audio
                            </label>
                            <audio
                                controls
                                src={audioUrl}
                                className="w-full"
                                preload="metadata"
                            />
                            <p className="text-sm text-muted-foreground">
                                Listen to the preview. Adjust settings and regenerate if needed, or finalize to create your MP3.
                            </p>
                        </div>
                        <Button
                            onClick={handleFinalize}
                            size="lg"
                            className="w-full text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Finalize & Create MP3
                        </Button>
                    </div>
                )}

                {/* Finalized Audio and Download */}
                {audioUrl && isFinalized && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                Final Audio
                            </label>
                            <audio
                                controls
                                src={audioUrl}
                                className="w-full"
                                preload="metadata"
                            />
                        </div>
                        <Button
                            onClick={handleDownload}
                            variant="outline"
                            size="lg"
                            className="w-full text-base font-semibold border-2"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Download MP3
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
