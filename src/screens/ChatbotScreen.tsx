// screens/ChatbotScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const { width } = Dimensions.get("window");

// Replace with your runtime config
const CHAT_URL = "https://yafjkpckhzpkrptmzcms.supabase.co/functions/v1/chat";
const PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZmprcGNraHpwa3JwdG16Y21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTk0MjEsImV4cCI6MjA4MDczNTQyMX0.T9lRcZSk-6UtywyLHYbSwzzXwns31Aj4sLyqWzICPBM";

const QUICK_REPLIES = [
  { label: "Find a Tutor", message: "How do I find a tutor?" },
  { label: "Book Session", message: "How to book a session?" },
  { label: "Pricing", message: "What are the pricing options?" },
  { label: "Become Tutor", message: "How can I become a tutor?" },
];

const WHATSAPP_DISPLAY = "+92 345 3284 284";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 60);
  };

  /**
   * Parse an SSE text string and return an array of parsed JSON objects in order.
   * Each "data: ..." line is tried to be parsed as JSON; non-JSON lines are ignored.
   */
  const parseSSEPayload = (sseText: string) => {
    const items: any[] = [];
    // Normalize line endings
    const text = sseText.replace(/\r\n/g, "\n");
    // Use regex to capture all lines that start with "data: "
    const dataRegex = /^data:\s*(.*)$/gm;
    let m;
    while ((m = dataRegex.exec(text)) !== null) {
      const jsonStr = m[1].trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        items.push(parsed);
      } catch {
        // ignore unparsable lines
      }
    }
    return items;
  };

  /**
   * Try to stream the chat. React Native runtimes often don't support streaming,
   * so we detect SSE content-type and parse resp.text() into SSE pieces instead.
   */
  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });
    console.log("Chat response status:", resp);
    const contentType = (resp.headers && resp.headers.get && resp.headers.get("content-type")) || "";

    // If server returned SSE (text/event-stream), read as text and parse data: lines.
    if (contentType.includes("text/event-stream")) {
      const sseText = await resp.text();
      const parsedItems = parseSSEPayload(sseText);

      // accumulate assistant content progressively
      let assistantContent = "";
      for (const parsed of parsedItems) {
        // Try several possible shapes:
        // 1) streaming "delta" shape: parsed.choices[0].delta.content
        // 2) full message shape: parsed.choices[0].message.content
        // 3) alternative shapes like parsed.result or parsed.content
        const deltaContent =
          parsed?.choices?.[0]?.delta?.content ??
          parsed?.choices?.[0]?.message?.content ??
          parsed?.result ??
          parsed?.content;

        if (!deltaContent) continue;

        assistantContent += deltaContent;

        // update UI: if last message is assistant, replace it; otherwise push new assistant message
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            // replace last assistant partial
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          // push new assistant message
          return [...prev, { role: "assistant", content: assistantContent }];
        });

        // give RN a moment to render updates so user sees incremental text
        // small pause — very short so it feels smooth
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 12));
      }

      // done — ensure final assistant message exists (if server used other shape)
      return;
    }

    // Non-SSE path: try parse as JSON and extract assistant text
    const text = await resp.text();
    try {
      const json = JSON.parse(text);
      // Common shapes: json.choices[0].message.content OR json.result OR json.content
      const assistant =
        json?.choices?.[0]?.message?.content ??
        json?.choices?.[0]?.message ??
        json?.result ??
        json?.content ??
        JSON.stringify(json);
      setMessages((prev) => [...prev, { role: "assistant", content: assistant }]);
    } catch {
      // not JSON — use raw text
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || isLoading) return;

    setShowQuickReplies(false);
    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Note: we send messages excluding the initial greeting if you want the server to have the full context,
      // you can send the entire 'newMessages' instead. Here we follow your earlier approach of newMessages.slice(1).
      await streamChat(newMessages.slice(1));
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = async () => {
    const message = encodeURIComponent("Hi, I need help with TutorsPool");
    const url = `https://wa.me/923453284284?text=${message}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://api.whatsapp.com/send?phone=923453284284&text=${message}`);
      }
    } catch (err) {
      console.warn("Couldn't open WhatsApp:", err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header (no close button as requested) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <MaterialIcons name="smartphone" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>TutorsPool</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        {/* Cross removed */}
        <View style={{ width: 36 }} />
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesWrapper}
        contentContainerStyle={{ padding: 12 }}
        ref={scrollRef}
      >
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <View key={i} style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
              {!isUser && <View style={styles.assistantAvatar} />}
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAssistant]}>
                  {m.content}
                </Text>
              </View>
              {isUser && <View style={styles.userAvatar} />}
            </View>
          );
        })}

        {/* Quick replies */}
        {showQuickReplies && messages.length === 1 && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.quickLabel}>Quick questions:</Text>
            <View style={styles.quickWrap}>
              {QUICK_REPLIES.map((q) => (
                <TouchableOpacity
                  key={q.label}
                  onPress={() => handleSend(q.message)}
                  style={styles.quickBtn}
                >
                  <Text style={styles.quickBtnText}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Loading indicator bubble (if waiting for assistant) */}
        {isLoading && (
          <View style={[styles.messageRow, styles.messageRowAssistant]}>
            <View style={styles.assistantAvatar} />
            <View style={[styles.bubble, styles.bubbleAssistant]}>
              <View style={{ flexDirection: "row", width: 40, justifyContent: "space-between" }}>
                <View style={[styles.dot]} />
                <View style={[styles.dot, { opacity: 0.75 }]} />
                <View style={[styles.dot, { opacity: 0.5 }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* WhatsApp button */}
      <View style={styles.whatsAppWrap}>
        <TouchableOpacity onPress={openWhatsApp} style={styles.whatsAppBtn}>
          <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
          <Text style={styles.whatsAppText}> Need Help? {WHATSAPP_DISPLAY}</Text>
        </TouchableOpacity>
      </View>

      {/* Input area */}
      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
          editable={!isLoading}
          multiline
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={!input.trim() || isLoading}
          style={[styles.sendBtn, (!input.trim() || isLoading) && { opacity: 0.6 }]}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#F97316",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 16 },
  onlineDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#34D399", marginRight: 6 },
  onlineText: { color: "rgba(255,255,255,0.9)", fontSize: 12 },

  messagesWrapper: { flex: 1, backgroundColor: "transparent" },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 6 },
  messageRowUser: { justifyContent: "flex-end" },
  messageRowAssistant: { justifyContent: "flex-start" },

  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F97316",
    marginRight: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    marginLeft: 8,
  },
  bubble: {
    maxWidth: width * 0.75,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  bubbleAssistant: {
    backgroundColor: "#fff",
    borderColor: "#E6E6E9",
    borderWidth: 1,
    borderBottomLeftRadius: 6,
  },
  bubbleUser: {
    backgroundColor: "#F97316",
    borderBottomRightRadius: 6,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  messageTextAssistant: { color: "#111827" },
  messageTextUser: { color: "#fff", fontWeight: "600" },

  quickLabel: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  quickWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.16)",
    backgroundColor: "rgba(249,115,22,0.06)",
    marginRight: 8,
    marginBottom: 8,
  },
  quickBtnText: { color: "#F97316", fontWeight: "600", fontSize: 13 },

  whatsAppWrap: { paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: "#E6E6E9", backgroundColor: "#fff" },
  whatsAppBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 12 },
  whatsAppText: { color: "#16A34A", fontWeight: "600", marginLeft: 8 },

  inputWrap: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E6E6E9",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6E9",
    backgroundColor: "#FFFFFF",
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#F97316",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  dot: { width: 8, height: 8, borderRadius: 6, backgroundColor: "#F97316" },
});
