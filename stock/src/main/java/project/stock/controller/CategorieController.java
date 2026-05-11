package project.stock.controller;

import project.stock.model.Categorie;
import project.stock.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final CategorieService categorieService;

    @GetMapping
    public List<Categorie> getAll() {
        return categorieService.findAll();
    }

    @PostMapping
    public ResponseEntity<Categorie> create(@RequestBody Categorie c) {
        return ResponseEntity.status(201).body(categorieService.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categorieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}