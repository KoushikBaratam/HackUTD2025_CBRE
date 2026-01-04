import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactMediaRecorder } from "react-media-recorder";
import { FaCircleStop, FaMicrophone } from 'react-icons/fa6'
import RecordRTC from "recordrtc";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false)
  const [recordedURL, setRecordedURL] = useState('')
  const [seconds, setSeconds] = useState(0)

  const mediaStream = useRef(null)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // --- Real API call to Flask /api/query ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const res = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errMsg = `Request failed (${res.status})`;
        try {
          const err = await res.json();
          if (err?.message) errMsg = err.message;
        } catch {
          /* ignore JSON parse errors */
        }
        throw new Error(errMsg);
      }

      // Expected backend shape per your app.py:
      // {
      //   success: true,
      //   message: "Query processed successfully.",
      //   query: "<echoed user query>",
      //   response: "<model's text>",
      //   matched_folders: ["folderA", "folderB"]
      // }
      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data?.response || 'No response generated.',
        timestamp: new Date(),
        structuredData: {
          matchedFolders: data?.matched_folders || [],
          serverMessage: data?.message || null,
          queryEcho: data?.query || null,
        },
        confidence: null,
        evidence: data?.matched_folders?.map(f => ({ type: 'folder', value: f })) || null,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content:
          error.name === 'AbortError'
            ? 'The request timed out. Please try again.'
            : `Sorry, there was an error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const sendTranscription = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // --- Real API call to Flask /api/query ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const res = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let errMsg = `Request failed (${res.status})`;
        try {
          const err = await res.json();
          if (err?.message) errMsg = err.message;
        } catch {
          /* ignore JSON parse errors */
        }
        throw new Error(errMsg);
      }

      // Expected backend shape per your app.py:
      // {
      //   success: true,
      //   message: "Query processed successfully.",
      //   query: "<echoed user query>",
      //   response: "<model's text>",
      //   matched_folders: ["folderA", "folderB"]
      // }
      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data?.response || 'No response generated.',
        timestamp: new Date(),
        structuredData: {
          matchedFolders: data?.matched_folders || [],
          serverMessage: data?.message || null,
          queryEcho: data?.query || null,
        },
        confidence: null,
        evidence: data?.matched_folders?.map(f => ({ type: 'folder', value: f })) || null,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content:
          error.name === 'AbortError'
            ? 'The request timed out. Please try again.'
            : `Sorry, there was an error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  async function uploadAudio(mediaBlob) {
    try {
      const formData = new FormData();
      formData.append("audio", mediaBlob, "audio.wav");

      const response = await fetch("http://localhost:5000/api/speech_to_text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.text;

      console.log(text);

      sendTranscription(text);

    }
    catch (e) {
      console.error("Error uploading recording:", e);
    }
  }

  // const RecordView = () => (
  //   <div>
  //     <ReactMediaRecorder
  //       audio
  //       render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
  //         <div>
  //           <p>{status}</p>
  //           <button onClick={startRecording}>Start Recording</button>
  //           <button onClick={stopRecording}>Stop Recording</button>
  //           <audio src={mediaBlobUrl} controls />
  //           <button onClick={convertSpeechToText}>Submit</button>
  //         </div>
  //       )}
  //     />
  //   </div>
  // );

  // const startRecording = async() => {
  //       setIsRecording(true)
  //       try{
  //           setSeconds(0)
  //           const stream = await navigator.mediaDevices.getUserMedia({audio: true})
  //           mediaStream.current = stream
  //           mediaRecorder.current = new MediaRecorder(stream)
  //           mediaRecorder.current.ondataavailable = (e) => {
  //               if (e.data.size > 0){
  //                   chunks.current.push(e.data)
  //               }
  //           }

  //           mediaRecorder.current.onstop = () => {
  //               const recordedBlob = new Blob(chunks.current,{type: 'audio/wav'})
  //               const mimeType = mediaRecorder.current.mimeType;
  //               console.log("Recording MIME type:", mimeType);
  //               const url = URL.createObjectURL(recordedBlob)
  //               setRecordedURL(url)
  //               uploadAudio(recordedBlob)

  //               chunks.current = []
  //           }

  //           mediaRecorder.current.start()

  //       }catch(error){
  //           console.log(error);
  //       }


  //   }

  //   const stopRecording = () => {
  //       setIsRecording(false)
  //       if(mediaRecorder.current){
  //           mediaRecorder.current.stop()
  //           mediaStream.current.getTracks().forEach(track => track.stop())
  //       }
  //   }

  const startRecording = async () => {
    setIsRecording(true);
    try {
      setSeconds(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      // Create RecordRTC instance
      mediaRecorder.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',  // ✅ Ensures WAV format
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1, // Mono for Whisper
      });

      // Start recording
      mediaRecorder.current.startRecording();

    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      // Stop recording
      mediaRecorder.current.stopRecording(() => {
        const recordedBlob = mediaRecorder.current.getBlob(); // WAV Blob
        const url = URL.createObjectURL(recordedBlob);
        setRecordedURL(url);

        // Upload the WAV blob
        uploadAudio(recordedBlob);

        // Clean up
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaRecorder.current = null;
      });
    }
  };


  const RecordView = () => (
    <div>
      {isRecording ? <button onClick={stopRecording} className='flex items-center justify-center text-[5px] bg-red-500 rounded-full p-4 text-white w-[50px] h-[50px]'>
            <FaCircleStop size={20}/>
        </button> : 
            <button onClick={startRecording} className='flex items-center justify-center text-[5px] bg-blue-500 rounded-full p-4 text-white w-[50px] h-[50px]'>
                <FaMicrophone size={20}/>
            </button>
        }
    </div>
  );

  return (
    <div className="min-h-screen bg-cbre-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-cbre-green rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">CC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ClauseChain</h1>
                <p className="text-xs text-gray-500">Contract Intelligence Platform</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/files')}
                className="text-sm text-gray-600 hover:text-cbre-green transition-colors"
              >
                Files
              </button>
              <button className="text-sm text-gray-600 hover:text-cbre-green transition-colors">
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ask about your documents</h2>
            <p className="text-sm text-gray-500 mt-1">
              Query your uploaded contracts and ESG documents
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Ask questions about your uploaded documents
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  <button
                    onClick={() => setInput('Which Dallas leases expire next quarter?')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Which Dallas leases expire next quarter?
                  </button>
                  <button
                    onClick={() => setInput('Find capex obligations over $250k')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Find capex obligations over $250k
                  </button>
                  <button
                    onClick={() => setInput('Extract Scope-2 targets from this ESG plan')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    Extract Scope-2 targets from this ESG plan
                  </button>
                  <button
                    onClick={() => setInput('What are the renewal windows for all leases?')}
                    className="px-4 py-2 text-left text-sm border border-gray-200 rounded-lg hover:border-cbre-green hover:bg-green-50 transition-colors"
                  >
                    What are the renewal windows for all leases?
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-cbre-green text-white'
                          : message.type === 'error'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.confidence && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <span className="text-xs font-medium">
                            Confidence: {(message.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                      {message.structuredData && (
                        <details className="mt-2">
                          <summary className="text-xs font-medium cursor-pointer">
                            View Structured Data
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                            {JSON.stringify(message.structuredData, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask a question about your documents..."
                  rows={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cbre-green focus:border-cbre-green resize-none overflow-y-auto"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <div>
                <RecordView />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-2 bg-cbre-green text-white rounded-lg hover:bg-cbre-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cbre-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;