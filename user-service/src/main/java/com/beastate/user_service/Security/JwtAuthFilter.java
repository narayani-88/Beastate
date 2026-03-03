package com.beastate.user_service.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

// OncePerRequestFilter = this filter runs ONCE per every HTTP request
// It intercepts every request and checks for JWT token
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,   // incoming request
            HttpServletResponse response, // outgoing response
            FilterChain filterChain)      // chain of filters
            throws ServletException, IOException {

        // STEP 1: Get the Authorization header
        // Every protected request must have:
        // Header: Authorization: Bearer eyJhbGci...
        final String authHeader = request.getHeader("Authorization");

        // STEP 2: If no header or doesn't start with "Bearer ", skip
        // This request will be rejected by SecurityConfig later
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // STEP 3: Extract the token (remove "Bearer " prefix)
        // "Bearer eyJhbGci..." → "eyJhbGci..."
        final String token = authHeader.substring(7);

        // STEP 4: Extract email from token
        final String email = jwtUtil.extractEmail(token);

        // STEP 5: If email found and user not already authenticated
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // STEP 6: Load user details from database
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // STEP 7: Validate the token
            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {

                // STEP 8: Create authentication object
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // STEP 9: Tell Spring Security this user is authenticated
                // Now they can access protected endpoints!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // STEP 10: Continue to the next filter / controller
        filterChain.doFilter(request, response);
    }
}