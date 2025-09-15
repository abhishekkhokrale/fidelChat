package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import com.example.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
// @CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "fidelchat.up.railway.app")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history")
    public List<ChatMessage> getHistory() {
        return chatService.getHistory();
    }

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatMessage handleMessage(ChatMessage message) {
        chatService.saveMessage(message.getSender(), message.getMessage());
        return message;
    }
}
