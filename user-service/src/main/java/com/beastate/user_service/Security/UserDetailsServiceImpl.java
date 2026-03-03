package com.beastate.user_service.Security;

import com.beastate.user_service.Model.User;
import com.beastate.user_service.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

// This class tells Spring Security HOW to load a user from our database
// Spring Security needs this to verify JWT tokens
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Find user in our database by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));

        // Convert our User to Spring Security's UserDetails format
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                // Convert our Role (BUYER) to Spring Security authority (ROLE_BUYER)
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}