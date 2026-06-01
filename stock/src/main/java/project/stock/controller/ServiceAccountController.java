package project.stock.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project.stock.service.ServiceAccountService;

@RestController
@RequestMapping("/api/service-accounts")
@RequiredArgsConstructor
public class ServiceAccountController {

    private final ServiceAccountService serviceAccountService;

    /**
     * Generate long-lived token for Prometheus
     * Only ADMIN can call this
     */
    @PostMapping("/generate-token")
    @PreAuthorize("hasRole('ADMIN')")
    public TokenResponse generateServiceToken(@RequestParam String email, @RequestParam String role) {
        String token = serviceAccountService.generateServiceToken(email, role);
        return new TokenResponse(token, "SERVICE_ACCOUNT", 365);
    }

    static class TokenResponse {
        public String token;
        public String type;
        public int expiresInDays;

        TokenResponse(String token, String type, int expiresInDays) {
            this.token = token;
            this.type = type;
            this.expiresInDays = expiresInDays;
        }
    }
}