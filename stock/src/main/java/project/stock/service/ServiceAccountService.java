package project.stock.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class ServiceAccountService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * Generate a long-lived token for service accounts (365 days)
     */
    public String generateServiceToken(String email, String role) {
        long expiryTime = 365 * 24 * 60 * 60 * 1000L; // 365 days in ms
        
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("type", "SERVICE_ACCOUNT")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiryTime))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
}