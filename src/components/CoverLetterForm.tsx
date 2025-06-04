/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import type { FormEvent } from "react";
import { jsPDF } from "jspdf";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CoverLetterForm: React.FC = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [resume, setResume] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [tone, setTone] = useState("Formal");
    const [geminiApiKey, setGeminiApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Generate the prompt for Gemini
    const generatePrompt = () => {
        return `Write a professional ${tone.toLowerCase()} cover letter for a job application. Here are the details:

**Candidate Information:**
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

**Candidate's Background/Experience:**
${resume}

**Job Description:**
${jobDesc}

**Instructions:**
1. Write a complete, well-structured cover letter
2. Address it to "Dear Hiring Manager" 
3. Use a ${tone.toLowerCase()} tone throughout
4. Highlight relevant experience from the candidate's background
5. Show enthusiasm for the specific role
6. Include proper paragraph structure
7. End with a professional closing and signature
8. Make it engaging and tailored to the job requirements

Please write the complete cover letter now:`;
    };

    // Gemini API call
    const callGeminiAPI = async (prompt: string) => {
        if (!geminiApiKey || geminiApiKey.length < 10) {
            throw new Error("Please enter a valid Gemini API key");
        }
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.9,
                        maxOutputTokens: 1000,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                const generatedText = result.candidates[0].content.parts[0].text;
                return generatedText.trim();
            } else {
                throw new Error("Unexpected response format from Gemini API");
            }
            
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error;
        }
    };

    const generateFallbackCoverLetter = () => {
        const toneAdjectives = {
            'Formal': 'professional and respectful',
            'Friendly': 'warm and approachable',
            'Confident': 'assured and capable',
            'Enthusiastic': 'excited and passionate'
        };

        return `Dear Hiring Manager,

I am writing to express my ${tone.toLowerCase() === 'enthusiastic' ? 'strong enthusiasm' : 'sincere interest'} in the position outlined in your job description. With my background and experience, I am confident that I would be a valuable addition to your team.

My relevant experience includes:
${resume.length > 300 ? resume.substring(0, 300) + '...' : resume}

I am particularly drawn to this opportunity because of the role's requirements and responsibilities. Based on the job description provided, I believe my skills and experience align well with what you are seeking in an ideal candidate.

My ${toneAdjectives[tone]} approach to work, combined with my technical abilities and professional experience, positions me well to contribute meaningfully to your organization's continued success.

I would welcome the opportunity to discuss how my background and qualifications can benefit your team. Thank you for considering my application, and I look forward to hearing from you soon.

Sincerely,
${name}
${email}
${phone}

---
Note: This is a template generated when API is unavailable. For a fully customized cover letter, please ensure your Gemini API key is valid.`;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCoverLetter("");
        setIsError(false);
        setErrorMessage("");

        try {
            if (geminiApiKey) {
                const prompt = generatePrompt();
                console.log("Generated prompt for Gemini:", prompt);
                
                const generatedContent = await callGeminiAPI(prompt);
                setCoverLetter(generatedContent);
            } else {
                const fallbackLetter = generateFallbackCoverLetter();
                setCoverLetter(fallbackLetter);
                setErrorMessage("No API key provided - using template. Add your Gemini API key for AI-generated content.");
            }
        } catch (error) {
            console.error("Error generating cover letter:", error);
            setErrorMessage(error.message);
            
            // Use fallback template if API fails
            const fallbackLetter = generateFallbackCoverLetter();
            setCoverLetter(fallbackLetter);
            setIsError(false); // Don't mark as error since we have a fallback
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        alert("Cover letter copied to clipboard!");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxLineWidth = pageWidth - margin * 2;
        
        doc.setFontSize(16);
        doc.text("Cover Letter", margin, 20);
        
        doc.setFontSize(11);
        const textLines = doc.splitTextToSize(coverLetter, maxLineWidth);
        doc.text(textLines, margin, 40);
        
        doc.save(`${name.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
    };

    return (
        <div className="mt-11 px-4 md:px-8 lg:px-12 py-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Cover Letter Generator Using Gemini</h1>
            </div>

            {/* Gemini Setup */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🤖 Google Gemini Setup (Free Tier Available):</h3>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                    <p><strong>Step 1:</strong> Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></p>
                    <p><strong>Step 2:</strong> Click "Create API Key" and select your project</p>
                    <p><strong>Step 3:</strong> Copy your API key and paste it below</p>
                    <p><strong>Step 4:</strong> Enjoy high-quality AI-generated cover letters!</p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">✅ Free tier: 15 requests per minute, 100 requests per day</p>
                </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
                <Label htmlFor="geminiApiKey">Gemini API Key (Optional)</Label>
                <Input
                    id="geminiApiKey"
                    type="password"
                    placeholder="Enter your Gemini API key for AI generation..."
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: "inherit", color: "inherit" }}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Leave empty to use a template generator. Add API key for AI-powered personalization.
                </p>
            </div>

            {/* Error/Info Display */}
            {errorMessage && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Info:</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{errorMessage}</p>
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Arnold Schwarzenegger"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: "inherit", color: "inherit" }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="xyz@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: "inherit", color: "inherit" }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXXXXXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: "inherit", color: "inherit" }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resume">Your Resume/Experience *</Label>
                    <Textarea
                        id="resume"
                        placeholder="Paste your resume or describe your relevant experience, skills, and achievements here..."
                        rows={8}
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        required
                        className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: "inherit", color: "inherit" }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="jobDesc">Job Description *</Label>
                    <Textarea
                        id="jobDesc"
                        placeholder="Paste the complete job description here..."
                        rows={8}
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        required
                        className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: "inherit", color: "inherit" }}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tone">Cover Letter Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: "inherit", color: "inherit" }}>
                            <SelectValue placeholder="Choose your preferred tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">Formal & Professional</SelectItem>
                            <SelectItem value="Friendly">Friendly & Approachable</SelectItem>
                            <SelectItem value="Confident">Confident & Assertive</SelectItem>
                            <SelectItem value="Enthusiastic">Enthusiastic & Passionate</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium">
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Cover Letter...
                        </span>
                    ) : (
                        "Generate Cover Letter"
                    )}
                </Button>
            </form>

            {/* Generated Cover Letter */}
            {coverLetter && (
                <div className="space-y-4 mt-8">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Generated Cover Letter</Label>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2">
                                📋 Copy
                            </Button>
                            <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                                📄 Download PDF
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        readOnly
                        value={coverLetter}
                        rows={20}
                        className="border-gray-300 rounded-md bg-gray-50 dark:bg-gray-900 font-mono text-sm"
                        style={{ backgroundColor: "inherit", color: "inherit" }}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Review and customize the generated cover letter before sending to employers
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverLetterForm;