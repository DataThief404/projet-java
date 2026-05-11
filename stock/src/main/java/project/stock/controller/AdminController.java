package project.stock.controller;

import project.stock.model.User;
import project.stock.model.Role;
import project.stock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers() { return userService.findAll(); }

    @PutMapping("/users/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestParam Role role) {
        return userService.updateRole(id, role);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}