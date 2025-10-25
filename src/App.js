import React, { useState, useRef } from 'react';
import { Upload, Mic, FileText, Download, Loader2, Play, Pause, Type, Sparkles, CheckCircle, ArrowRight, Zap, Target, BarChart3 } from 'lucide-react';

export default function SermonTranscriber() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'audio'
  
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleTextFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      try {
        const text = await file.text();
        setTranscription(text);
        setMetadata(null);
        setError('');
      } catch (err) {
        setError('Failed to read text file: ' + err.message);
      }
    } else {
      setError('Please upload a .txt file');
    }
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setTranscription('');
      setMetadata(null);
      setError('');
    } else {
      setError('Please upload an audio file');
    }
  };

  const startTranscription = async () => {
    if (!audioFile) {
      setError('Please upload an audio file first');
      return;
    }

    setIsTranscribing(true);
    setError('');
    setTranscription('');

    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioUrl = URL.createObjectURL(audioFile);
      audioRef.current = new Audio(audioUrl);
      
      // Set up audio playback
      audioRef.current.onloadeddata = () => {
        audioRef.current.play();
      };

      audioRef.current.onended = () => {
        setIsTranscribing(false);
        URL.revokeObjectURL(audioUrl);
      };

      // For now, we'll simulate transcription with a placeholder
      // In a real implementation, you'd use a service like:
      // - OpenAI Whisper API
      // - Google Cloud Speech-to-Text
      // - Azure Speech Services
      // - AssemblyAI
      
      setError('Audio transcription requires an external service. For now, please use the text input method or try services like ElevenLabs, OpenAI Whisper, or Google Cloud Speech-to-Text.');
      setIsTranscribing(false);
      
      // Simulate some processing time
      setTimeout(() => {
        setTranscription('Audio transcription is not available in this demo. Please use the text input method or upload a .txt file with your transcription.');
      }, 2000);

    } catch (err) {
      setError('Audio processing failed: ' + err.message);
      setIsTranscribing(false);
    }
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsTranscribing(false);
  };

  const generateMetadata = async () => {
    if (!transcription.trim()) {
      setError('Please provide a transcription first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/generate-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcription
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate metadata');
      }

      const metadataJson = await response.json();
      setMetadata(metadataJson);
    } catch (err) {
      setError('Failed to generate metadata: ' + err.message + '. Make sure the server is running (npm run server).');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportData = () => {
    if (!transcription || !metadata) {
      setError('Cannot export: missing transcription or metadata');
      return;
    }

    try {
      const exportText = `SERMON TRANSCRIPTION & METADATA
${'='.repeat(50)}

TITLE:
${metadata.title}

DESCRIPTION:
${metadata.description}

TAGS:
${metadata.tags.join(', ')}

SUMMARY:
${metadata.summary}

FULL TRANSCRIPTION:
${transcription}

${'='.repeat(50)}
Generated on ${new Date().toLocaleDateString()}`;

      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sermon-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setError('');
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  const resetAll = () => {
    setAudioFile(null);
    setTranscription('');
    setMetadata(null);
    setError('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
              <Sparkles className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              Sermon Transcriber
            </h1>
            <h2 className="text-2xl font-semibold mb-6 text-indigo-100">
              & Metadata Generator
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your sermons into engaging YouTube content with AI-powered metadata generation
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Target className="w-4 h-4" />
                <span>YouTube Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <BarChart3 className="w-4 h-4" />
                <span>SEO Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="p-8">

            {/* Input Mode Selection */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Choose Input Method</h2>
                  <p className="text-gray-600">Select how you'd like to provide your sermon content</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setInputMode('text');
                    setAudioFile(null);
                    setError('');
                  }}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    inputMode === 'text'
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      inputMode === 'text' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
                    }`}>
                      <Type size={32} className={inputMode === 'text' ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Text Input</h3>
                      <p className="text-gray-600">Paste or upload your transcription</p>
                    </div>
                    {inputMode === 'text' && (
                      <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                        <CheckCircle size={20} />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    setInputMode('audio');
                    setTranscription('');
                    setError('');
                  }}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    inputMode === 'audio'
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      inputMode === 'audio' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100'
                    }`}>
                      <Mic size={32} className={inputMode === 'audio' ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Audio File</h3>
                      <p className="text-gray-600">Upload and transcribe audio</p>
                    </div>
                    {inputMode === 'audio' && (
                      <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                        <CheckCircle size={20} />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Text Input Mode */}
            {inputMode === 'text' && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Provide Transcription</h2>
                    <p className="text-gray-600">Upload a file or paste your sermon text directly</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <label className="group flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                      <Upload size={24} />
                      <span className="font-semibold text-lg">Upload .txt File</span>
                      <input
                        type="file"
                        accept=".txt"
                        onChange={handleTextFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="w-12 h-px bg-gray-300"></div>
                      <span className="font-semibold">OR</span>
                      <div className="w-12 h-px bg-gray-300"></div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                      <Type size={20} />
                      <span className="font-medium">paste text below</span>
                    </div>
                  </div>
                  <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200">
                    <textarea
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      className="w-full h-64 p-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 resize-none text-lg leading-relaxed"
                      placeholder="Paste your sermon transcription here (from macOS Dictation, Whisper, or any other source)..."
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                      <FileText size={16} />
                      <span>{transcription.length} characters</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Input Mode */}
            {inputMode === 'audio' && (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">2</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Upload Audio File</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Upload size={20} />
                      <span className="font-medium">Choose Audio File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileUpload}
                        className="hidden"
                      />
                    </label>
                    {audioFile && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">
                          {audioFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {audioFile && (
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Audio Transcription</h2>
                        <p className="text-gray-600">Audio file uploaded - transcription requires external service</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-8">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Mic className="text-white" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Audio File Ready</h3>
                        <p className="text-gray-600 mb-4">Browser-based audio transcription is not available. Use one of these alternatives:</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white bg-opacity-60 rounded-xl p-4 border border-orange-200">
                          <h4 className="font-semibold text-gray-800 mb-2">🎤 ElevenLabs</h4>
                          <p className="text-sm text-gray-600 mb-3">High-quality AI transcription service</p>
                          <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Try ElevenLabs →
                          </a>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-xl p-4 border border-orange-200">
                          <h4 className="font-semibold text-gray-800 mb-2">🤖 OpenAI Whisper</h4>
                          <p className="text-sm text-gray-600 mb-3">Free, accurate transcription</p>
                          <a href="https://openai.com/whisper" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Try Whisper →
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={startTranscription}
                          disabled={isTranscribing}
                          className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                          {isTranscribing ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              <span className="font-medium">Processing...</span>
                            </>
                          ) : (
                            <>
                              <FileText size={20} />
                              <span className="font-medium">Use Text Input Instead</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setInputMode('text')}
                          className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Type size={20} />
                          <span className="font-medium">Switch to Text Mode</span>
                        </button>
                      </div>
                      
                      <p className="text-sm text-orange-700 mt-4 flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        Upload your transcription as a .txt file or paste it directly
                      </p>
                    </div>
                  </div>
                )}

                {transcription && inputMode === 'audio' && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">4</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Review Transcription</h2>
                    </div>
                    <div className="relative">
                      <textarea
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 resize-none"
                        placeholder="Your transcription will appear here..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {transcription.length} characters
                      </div>
                    </div>
                  </div>
                )}
          </>
        )}

            {/* Error Display */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Generate Metadata */}
            {transcription && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {inputMode === 'text' ? '3' : '5'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Generate YouTube Metadata</h2>
                    <p className="text-gray-600">Let AI create compelling titles, descriptions, and tags</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Sparkles className="text-white" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Metadata Generation</h3>
                    <p className="text-gray-600">Our AI will analyze your sermon and create optimized YouTube content</p>
                  </div>
                  <button
                    onClick={generateMetadata}
                    disabled={isGenerating}
                    className="group w-full flex items-center justify-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" size={28} />
                        <span className="text-xl font-bold">Generating with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={28} />
                        <span className="text-xl font-bold">Generate Metadata with AI</span>
                        <ArrowRight size={24} />
                      </>
                    )}
                  </button>
                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-white bg-opacity-60 px-4 py-2 rounded-full">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-medium">SEO Optimized</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white bg-opacity-60 px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-medium">AI Powered</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white bg-opacity-60 px-4 py-2 rounded-full">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700 font-medium">YouTube Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Display */}
            {metadata && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Generated Metadata</h2>
                    <p className="text-gray-600">Review and edit your AI-generated YouTube content</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-emerald-600" />
                          Title
                        </label>
                        <input
                          type="text"
                          value={metadata.title}
                          onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 text-xl font-semibold"
                          placeholder="Your YouTube title will appear here..."
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                          Tags
                        </label>
                        <input
                          type="text"
                          value={metadata.tags.join(', ')}
                          onChange={(e) => setMetadata({...metadata, tags: e.target.value.split(',').map(t => t.trim())})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200"
                          placeholder="Enter tags separated by commas"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          {metadata.tags.map((tag, index) => (
                            <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          Description
                        </label>
                        <textarea
                          value={metadata.description}
                          onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                          className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 resize-none"
                          placeholder="Your YouTube description will appear here..."
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-emerald-600" />
                          Summary
                        </label>
                        <textarea
                          value={metadata.summary}
                          onChange={(e) => setMetadata({...metadata, summary: e.target.value})}
                          className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 resize-none"
                          placeholder="A brief summary will appear here..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {metadata && (
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={exportData}
                  className="group flex items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Download size={24} />
                  <span className="text-lg font-bold">Export All Data</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={resetAll}
                  className="group flex items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <span className="text-lg font-bold">Start New Sermon</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Progress Tracker */}
            <div className="mt-16 pt-8 border-t-2 border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-2xl">💡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Workflow Tip</h3>
                    <div className="bg-white bg-opacity-60 rounded-xl p-4 mb-4">
                      <p className="text-gray-700 mb-3 font-medium">
                        <strong>Recommended workflow:</strong>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">1. macOS Dictation</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">2. Save as .txt</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">3. Upload here</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">4. Generate metadata</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">5. Export!</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      This app will be here whenever you return to this conversation. Perfect for working through all 300 sermons!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}