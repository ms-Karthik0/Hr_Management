package com.zidio.nexushr.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        String authority = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_EMPLOYEE");
        return generateTokenFromUsername(userPrincipal.getUsername(), jwtExpirationMs, authority, null);
    }

    public String generateRefreshToken(String username) {
        return generateTokenFromUsername(username, refreshExpirationMs, "ROLE_EMPLOYEE", null);
    }

    public String generateTokenFromUsername(String username, long expiration) {
        return generateTokenFromUsername(username, expiration, "ROLE_EMPLOYEE", null);
    }

    public String generateTokenFromUsername(String username, long expiration, String authority, Long employeeId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        var builder = Jwts.builder()
                .subject(username)
                .claim("authority", authority)
                .issuedAt(now)
                .expiration(expiryDate);
        if (employeeId != null) {
            builder.claim("employeeId", employeeId);
        }
        return builder.signWith(getSigningKey(), Jwts.SIG.HS256).compact();
    }

    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public String getAuthorityFromJwt(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("authority", String.class);
    }
}
