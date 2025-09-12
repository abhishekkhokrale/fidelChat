package com.example.chat.service;

import com.example.chat.model.ChatMessage;
import com.example.chat.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    private final ChatMessageRepository repo;

    public ChatService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage saveMessage(String sender, String message) {
        ChatMessage chat = new ChatMessage();
        chat.setSender(sender);
        chat.setMessage(message);
        return repo.save(chat);
    }

    public List<ChatMessage> getHistory() {
        return repo.findAllByOrderByTimestampAsc();
    }
}
