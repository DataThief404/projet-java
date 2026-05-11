package project.stock.security;

import project.stock.model.User;
import project.stock.model.Role;
import project.stock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email()))
            throw new RuntimeException("Email déjà utilisé");
        if (userRepository.existsByUsername(req.username()))
            throw new RuntimeException("Username déjà pris");

        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Email introuvable"));

        if (!passwordEncoder.matches(req.password(), user.getPassword()))
            throw new RuntimeException("Mot de passe incorrect");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name());
    }
}