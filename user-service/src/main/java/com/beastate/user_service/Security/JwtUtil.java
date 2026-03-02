package com.beastate.user_service.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.hibernate.mapping.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

        @Value("${jwt.secret}")
        private String secret;
        @Value("${jwt.expiration}")
        private long expiration;

public String generateToken(String email){
               return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())


}
}
