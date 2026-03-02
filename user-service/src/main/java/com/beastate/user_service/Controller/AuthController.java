package com.beastate.user_service.Controller;

import com.beastate.user_service.DTO.AuthResponse;
import com.beastate.user_service.DTO.LoginRequest;
import com.beastate.user_service.DTO.RegisterRequest;
import com.beastate.user_service.Services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController = @Controller + @ResponseBody
// Means: "This class handles HTTP requests and returns JSON"
@RestController

// All endpoints in this class will start with /api/auth
// So register = /api/auth/register
//    login    = /api/auth/login
@RequestMapping("/api/auth")

// Allow requests from frontend (React app)
// Without this, browser will block the request (CORS policy)
@CrossOrigin(origins = "*")

@RequiredArgsConstructor
public class AuthController {

    // Spring injects AuthService automatically
    private final AuthService authService;

    // =============================================
    // REGISTER ENDPOINT
    // POST /api/auth/register
    // Body: { fullName, email, password, phone }
    // =============================================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        // @RequestBody = read JSON from request body
        // @Valid = run the validations we set in RegisterRequest
        //         (e.g. @NotBlank, @Email, @Size)

        AuthResponse response = authService.register(request);

        // ResponseEntity lets us control the HTTP status code
        // 201 CREATED = success, a new resource was created
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // =============================================
    // LOGIN ENDPOINT
    // POST /api/auth/login
    // Body: { email, password }
    // =============================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        // 200 OK = success
        return ResponseEntity.ok(response);
    }
}
