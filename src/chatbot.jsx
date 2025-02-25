import { useState, useEffect, useRef } from "react";
import { CardContent, Typography, IconButton, TextField, Box, Paper, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ChatBubbleOutline } from "@mui/icons-material";

const symptomOptions = ["Dry cough", "High temperature", "Shivering", "Muscle Ache", "None of these"];

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hey there 👋\nPlease enter your name?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState(1);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text) => {
        if (!text.trim()) return;
        setMessages([...messages, { text, sender: "user" }]);

        setTimeout(() => {
            let newMessage = "";
            let nextStep = step;

            if (step === 1) {
                newMessage = `Nice to meet you, ${text}!\nPlease enter your phone number.`;
                nextStep = 2;
            } else if (step === 2) {
                newMessage = "What kind of problem are you facing?";
                nextStep = 3;
            } else if (step === 3) {
                newMessage = "How long have you been experiencing this issue?";
                nextStep = 4;
            } else if (step === 4) {
                newMessage = "Do you also have any of these symptoms?";
                nextStep = 5;
            } else if (step === 5) {
                newMessage = "Would you like to book an appointment? (Yes/No)";
                nextStep = 6;
            } else if (step === 6) {
                if (text.toLowerCase() === "yes") {
                    const tokenNumber = Math.floor(1 + Math.random() * 10);
                    const appointmentDate = new Date();
                    appointmentDate.setDate(appointmentDate.getDate() + 1);
                    const formattedDate = appointmentDate.toLocaleDateString();
                    const appointmentTime = "4:00 PM";
                    newMessage = `Your appointment is booked!\nToken Number: ${tokenNumber}\nDate: ${formattedDate}\nTime: ${appointmentTime}`;
                } else {
                    newMessage = "Alright! Let us know if you need any help in the future.";
                }
                nextStep = 7;
            }

            setMessages((prev) => [...prev, { text: "Thinking...", sender: "bot" }]);

            setTimeout(() => {
                setMessages((prev) => prev.slice(0, -1).concat({ text: newMessage, sender: "bot" }));
                setStep(nextStep);
            }, 1000);
        }, 1000);

        setInput("");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <Paper elevation={8} className="w-96 !rounded-xl overflow-hidden bg-white border border-gray-300 shadow-2xl">
                <div className="bg-blue-700 text-white flex items-center p-4 rounded-t-xl shadow-md">
                    <ChatBubbleOutline className="mr-2" />
                    <Typography variant="h6" className="font-medium">Clinic Chatbot</Typography>
                </div>

                <CardContent className="h-96 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3`}>
                            <Box
                                className={`p-3 rounded-2xl max-w-xs text-sm whitespace-pre-wrap shadow-md transition-all duration-300 ease-in-out transform ${msg.sender === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-200 text-gray-800 self-start"
                                    }`}
                            >
                                {msg.text}
                            </Box>

                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>

                {step === 5 ? (
                    <div className="p-3 flex flex-wrap gap-2 bg-white border-t rounded-b-xl justify-center">
                        {symptomOptions.map((symptom, index) => (
                            <Button
                                key={index}
                                variant="contained"
                                color="primary"
                                className="px-4 py-2 rounded-lg capitalize shadow-md"
                                onClick={() => handleSendMessage(symptom)}
                            >
                                {symptom}
                            </Button>
                        ))}
                    </div>
                ) : step < 7 ? (
                    <div className="p-3 flex items-center bg-white border-t rounded-b-xl">
                        <TextField
                            variant="outlined"
                            placeholder="Type a message..."
                            size="small"
                            className="flex-1"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                            fullWidth
                        />
                        <IconButton color="primary" onClick={() => handleSendMessage(input)} className="ml-2">
                            <SendIcon />
                        </IconButton>
                    </div>
                ) : null}
            </Paper>
        </div>
    );
};

export default Chatbot;
