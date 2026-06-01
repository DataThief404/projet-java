package project.stock.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project.stock.model.Role;
import project.stock.model.User;
import project.stock.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@test.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("✅ Admin user created automatically!");
        }

        // Create Prometheus service account if not exists
        if (userRepository.findByEmail("prometheus@internal").isEmpty()) {
            User prometheus = new User();
            prometheus.setUsername("prometheus");
            prometheus.setEmail("prometheus@internal");
            prometheus.setPassword(passwordEncoder.encode("prometheus"));
            prometheus.setRole(Role.ROLE_USER);  // Use ROLE_USER (no ROLE_PROMETHEUS)
            prometheus.setEnabled(true);
            userRepository.save(prometheus);
            System.out.println("✅ Prometheus service account created!");
        }
    }
}